defmodule MDM.CollectMachineMetric do
  # TODO change file name
  require Logger
  @interval 10_000 #ms
  @behaviour MDM.Monitor

  @moduledoc """
  This is a module to monitor resources of the whole target machine.

  Because we only use erlang function to get needed data, we don't need
  to have any backends on mdmminion side and can simply do an rpc call.
  """

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
      {
        machine.name,
        :rpc.call(Machine.node_name(machine), :cpu_sup, :util, [[]]),
        :rpc.call(Machine.node_name(machine), :memsup, :get_memory_data, [])
      }
      end)
  end

  defp send_metrics(metrics) do
    parsed_metrics = metrics
                     |> Enum.reduce([], &parse_metric/2)
    payload = %{"machines" => parsed_metrics}
    Event.new_event(:machine_metrics, payload)
    |> WSCommunicator.push_event()
  end

  defp parse_metric({name, cpu, memory}, acc) do
    cpu_m = parse_cpu(cpu)
    mem_m = parse_mem(memory)
    metrics = %{"cpu" => cpu_m, "mem" => mem_m}
    [%{"machine_name" => name, "metrics" => metrics}
     | acc]
  end

  defp parse_cpu({:badrpc, reason}) do
    %{"is_ok" => false, "reason" => inspect(reason)}
  end
  defp parse_cpu({:all, busy, non_busy, _}) do
    percent = busy * 100 / non_busy
    %{"is_ok" => true, "val" => percent, "unit" => "%"}
  end

  defp parse_mem({:badrpc, reason}) do
    %{"is_ok" => false, "reason" => inspect(reason)}
  end
  defp parse_mem({0, _allocated, _worst}) do
    Logger.warn("Got total memory 0 bytes. Is memsup turned on on minions?")
    %{"is_ok" => false, "reason" => "internal server error (is memsup turned on on minions?)"}
  end
  defp parse_mem({total, allocated, _worst}) do
    {total, allocated} |> IO.inspect
    percent = allocated * 100 / total
    %{"is_ok" => true, "val" => percent, "unit" => "%"}
  end

end


