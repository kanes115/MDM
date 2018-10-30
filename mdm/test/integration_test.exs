defmodule IntegrationTests do
  use ExUnit.Case, async: false
  import JmmsrHelpers

  @example_dir_on_pilot "/examples"
  @ping_res_file "/ping.txt"
  @minion_tmp_dir "/root/tmp_mdm"
  @minion_services_file "/root/mdm_services"
  @url "ws://pilot:8080"

  setup do
    # We don't use start_link because on_exit is run
    # in another process and this one dies
    {:ok, pid} = WebSocket.start(@url, self())
    on_exit fn ->
      # TODO
      # Now it might happen (and happens ofetntimes) that
      # on_exit will stop executing and therefore the connection won't
      # manage to close and will be closed brutally
      #
      # Also close function might not be good, needs investigation
      # but we don't fix it now as it does not have any big consequences
      # the only thing that happen is that ws_communicator gets an error,
      # it restarts and continues to work properly.
      #
      # Probable solution - linking to the process, trapping exits
      # WebSockex does not provide an elegant way to close connection (sic!)
      WebSocket.close

      MDMRpc.minion_call(File, :rm, [@ping_res_file])
      MDMRpc.minion_call(File, :rm_rf, [@minion_tmp_dir])
      MDMRpc.minion_call(File, :rm_rf, [@minion_services_file])
      # We have to restart application to initiate it with a new state
      # (state contains info about saved files which we deleted above)
      MDMRpc.minion_call(Application, :stop, [:mdmminion])
      MDMRpc.minion_call(Application, :ensure_all_started, [:mdmminion])
    end
    :ok
  end

  test "Extra connections are rejected (only one at a time)" do
    {:error, %WebSockex.ConnError{original: :timeout}}
    = WebSocket.start_anonymous(@url)
  end

  test "Command check_correctness returns 200 and is_ok=true if parsed correctly" do
    basic_jmmsr()
    |> check_correctness
    |> Poison.encode!
    |> WebSocket.send_text()
    resp = WebSocket.receive() |> Poison.decode!
    200 = resp["code"]
    "check_correctness" = resp["command_name"]
    %{"is_ok" => true} = resp["body"]
  end

  test "Command check_correctness returns 200 and is_ok=false along with error details if not parsed correctly" do
    basic_jmmsr()
    |> JmmsrHelpers.add_to_list(["machines"], machine(
      43, # worng name type
      3232))
    |> check_correctness
    |> Poison.encode!
    |> WebSocket.send_text()
    resp = WebSocket.receive() |> Poison.decode!
    200 = resp["code"]
    "check_correctness" = resp["command_name"]
    %{"is_ok" => false, "path" => "machines, name", "reason" => "type_mismatch"} = resp["body"]
  end


  test "Command collect_data returns collected data" do
    basic_jmmsr()
    |> collect_data
    |> Poison.encode!
    |> WebSocket.send_text()
    resp = WebSocket.receive() |> Poison.decode!
    200 = resp["code"]
    "collect_data" = resp["command_name"]
    "collected" = resp["msg"]
    collected_machines = resp["body"]["collected_data"]
    2 = length(collected_machines)
    collected_machines
    |> Enum.each(fn m -> check_collected_machine(m, basic_jmmsr()["machines"]) end)
  end

  test "Command collect_data can be called multiple times with almost the same result (expect collected resources)" do
    text = basic_jmmsr()
           |> collect_data
           |> Poison.encode!
    WebSocket.send_text(text)
    WebSocket.send_text(text)
    resp1 = WebSocket.receive() |> Poison.decode! 
    resp2 = WebSocket.receive() |> Poison.decode!
    m1 = resp1["body"]["collected_data"]
         |> Enum.map(fn %{"machine" => m} -> Map.delete(m, "resources") end)
    m2 = resp2["body"]["collected_data"]
         |> Enum.map(fn %{"machine" => m} -> Map.delete(m, "resources") end)
    assert m1 == m2
  end

  test "On Jmmsr parser error, error is returned in specific format and req can be repeated" do
    basic_jmmsr()
    |> JmmsrHelpers.add_to_list(["machines"], machine(
      43, # worng name type
      3232))
      |> collect_data
      |> Poison.encode!
      |> WebSocket.send_text
      resp = WebSocket.receive() |> Poison.decode!
      %{
        "body" => %{"path" => "machines, name", "reason" => "type_mismatch"},
        "code" => 400,
        "command_name" => "collect_data",
        "msg" => "error"
      } = resp
      basic_jmmsr()
      |> collect_data
      |> Poison.encode!
      |> WebSocket.send_text
      resp2 = WebSocket.receive() |> Poison.decode!
      # TODO extract common part (correct response)
      200 = resp2["code"]
      "collect_data" = resp2["command_name"]
      "collected" = resp2["msg"]
      collected_machines = resp2["body"]["collected_data"]
      2 = length(collected_machines)
      collected_machines
      |> Enum.each(fn m -> check_collected_machine(m, basic_jmmsr()["machines"]) end)
  end


  test "(pinger system) Command deploy deploys example services to exactly one machine specified (dump decider)" do
    text = basic_jmmsr(Path.join(@example_dir_on_pilot, "pingers_system/some_server"),
                       Path.join(@example_dir_on_pilot, "pingers_system/some_server2"))
           |> collect_data
           |> Poison.encode!
           |> WebSocket.send_text
    WebSocket.receive()
    deploy()
    |> Poison.encode!
    |> WebSocket.send_text
    %{"body" => %{},
      "code" => 200,
      "command_name" => "deploy",
      "msg" => "deployed"} = WebSocket.receive() |> Poison.decode!
    wait_for_ping()
    ping_res = {:ok, "0\n"}
    ^ping_res = MDMRpc.call(:minion1, File, :read, ["/ping.txt"])
    ^ping_res = MDMRpc.call(:minion2, File, :read, ["/ping.txt"])
    # logs are created
    IO.puts "---- logs ----"
    MDMRpc.call(:minion1, File, :read, ["/mdm_logs/some_server_log.log"])
    |> IO.inspect
    WebSocket.receive() |> IO.inspect
    WebSocket.receive() |> IO.inspect
  end



  ## HELPERS

  defp wait_for_ping, do: :timer.sleep(5000)

  defp check_correctness(jmmsr) do
    %{"command_name" => "check_correctness",
      "body" => jmmsr}
  end

  defp collect_data(jmmsr) do
    %{"command_name" => "collect_data",
      "body" => jmmsr}
  end

  defp deploy do
    %{"command_name" => "deploy",
      "body" => %{}}
  end
  
  def basic_jmmsr(some_server_path \\ "./some/fake/dir", some_server2_path \\ "./some/fake/dir/") do
      %{
        "config" => %{
          "metrics" => ["cpuUsage"],
          "persist" => true,
          "persist_machine" => 34,
          "pilot_machine" => 34
        },
        "connections" => [
        ],
        "machines" => [
          machine("minion1_pc", 38, "linux", [{"ip", MDMRpc.get_minion1_ip()}]),
          machine("minion2_pc", 39, "linux", [{"domain", "minion2.com"}])
        ],
        "services" => [
          service("some_server", [38], some_server_path),
          service("some_server2", [39], some_server2_path)
        ],
        "live_metrics" => [
          live_metric({:service, "some_server"}, "cpu", {456, "ms"})
        ]
      }
  end

  defp check_collected_machine(%{"machine" => machine, "ok?" => true}, expected_machines) do
    %{"name" => name} = machine
    expected_machine = expected_machines |> Enum.find(fn %{"name" => n} -> n == name end)
    assert expected_machine["name"] == machine["name"]
    assert expected_machine["ip"] == machine["ip"]
    assert expected_machine["domain"] == machine["domain"]
    assert expected_machine["id"] == machine["id"]
    assert expected_machine["os"] == machine["os"]
    assert Map.has_key?(machine, "resources")
  end
  
end
