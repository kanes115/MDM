defmodule IntegrationTests do
  use ExUnit.Case
  import JmmsrHelpers

  # TODO start socket in init_per_suite

  setup do
    {:ok, pid} = WebSocket.start_link("ws://pilot:8080", self())
    on_exit fn ->
      # TODO do it synchronously
      Process.exit(pid, :kill)
      :timer.sleep(30)
    end
    :ok
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

  #
  #  test "Command deploy deploys example services to exactly one machine specified (dump decider)" do
  #    {:ok, pid} = WebSocket.start_link("ws://pilot:8080", self())
  #    text = basic_jmmsr()
  #           |> collect_data
  #           |> Poison.encode!
  #    WebSocket.send_text(pid, text)
  #    deploy()
  #    |> Poison.encode!
  #    resp1 = WebSocket.receive(pid) |> Poison.decode! 
  #    WebSockex.send_frame(pid, {:close, "going_away"})
  #  end



  ## HELPERS

  defp collect_data(jmmsr) do
    %{"command_name" => "collect_data",
      "body" => jmmsr}
  end

  defp deploy do
    %{"command_name" => "deploy",
      "body" => %{}}
  end
  
  def basic_jmmsr do
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
          service("some_server", [38], "./some/fake/dir"),
          service("some_other_server", [39], "./some/fake/dir/")
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
