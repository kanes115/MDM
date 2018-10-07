defmodule IntegrationTests do
  use ExUnit.Case
  import JmmsrHelpers

  defmodule WebSocketExample do
    use WebSockex

    def start_link(url, report_to) do
      WebSockex.start_link(url, __MODULE__, report_to)
    end

    def handle_frame({type, msg}, report_to) do
      IO.puts "Received Message - Type: #{inspect type} -- Message: #{inspect msg}"
      send report_to, msg
      {:ok, report_to}
    end

    def handle_cast({:send, {type, msg} = frame}, state) do
      IO.puts "Sending #{type} frame with payload: #{msg}"
      {:reply, frame, state}
    end
  end


  test "greets the world" do
    MDMRpc.call(:minion2, Node, :list, [])
    |> IO.inspect
    MDMRpc.call(:minion1, Node, :list, [])
    |> IO.inspect
    MDMRpc.call(:pilot, Node, :list, [])
    |> IO.inspect
    #    {:ok, pid} = IntegrationTests.WebSocketExample.start_link("ws://pilot:8080", self())
    #    text = basic_jmmsr()
    #           |> collect_data
    #           |> Poison.encode!
    #    WebSockex.send_frame(pid, {:text, text})
    #    receive do
    #      a -> IO.inspect a
    #    end
    #    
    #    WebSockex.send_frame(pid, {:close, "going_away"})
    #    socket = Socket.Web.connect! "ws://pilot:8080"
    #    socket |> Socket.Web.send! {:text, @example_jmmsr}
    #    socket |> Socket.Web.recv!() |> IO.inspect() # => {:text, "test"}
    assert MDM.hello() == :world
  end


  ## HELPERS

  defp collect_data(jmmsr) do
    %{"command_name" => "collect_data",
      "body" => jmmsr}
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
          service("some_server", [38], "./big_tests/examples/some_server/"),
          service("some_other_server", [39], "./big_tests/examples/some_server/")
        ],
        "live_metrics" => [
          live_metric({:service, "some_server"}, "cpu", {456, "ms"})
        ]
      }
  end

  
end
