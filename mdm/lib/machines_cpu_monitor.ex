defmodule MDM.CollectMachineMetric do
  @interval 10_000 #ms
  @behaviour MDM.Monitor

  alias MDM.Machine
  alias MDM.Event
  alias MDM.WSCommunicator

  def get_task_fun(machines) do
    fn -> collect_loop(machines) end
  end

  defp collect_loop(machines) do
    receive do
    after
      @interval ->
        metrics = get_metrics(machines)
        send_metrics(metrics)
        collect_loop(machines)
    end
  end

  defp get_metrics(machines) do
    machines
    |> Enum.map(fn machine ->
      {machine.name, :rpc.call(Machine.node_name(machine), :cpu_sup, :util, [[]])} end)
  end

  defp send_metrics(metrics) do
    parsed_metrics = metrics
                     |> Enum.reduce([], &parse_metric/2)
    payload = %{"metrics" => parsed_metrics}
    Event.new_event(:machine_metrics, payload)
    |> MDM.WSCommunicator.push_event()
  end

  defp parse_metric({name, {:badrpc, reason}}, acc) do
    [%{"name" => name, "is_ok" => false, "reason" => inspect(reason)}
     | acc]
  end
  defp parse_metric({name, {:all, busy, non_busy, _}}, acc) do
    percent = busy / non_busy
    [%{"name" => name, "is_ok" => true, "metric_name" => "cpu",
      "util_percentage" => percent} | acc]
  end

end


