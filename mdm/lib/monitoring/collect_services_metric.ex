defmodule MDM.CollectServicesMetric do
  require Logger
  @interval 2_000 #ms
  @behaviour MDM.Monitor

  @moduledoc """
  This is a module to monitor resources of the whole target machine.
  """

  alias MDM.Machine
  alias MDM.Event
  alias MDM.EventPusher

  defmodule Parallel do
    # TODO extract and use in different places probably
    def map(collection, func) do
      collection
      |> Enum.map(&(Task.async(fn -> func.(&1) end)))
      |> Enum.map(fn t -> Task.await(t) end)
    end
  end


  def get_task_fun(decision) do
    # if we want to have fresher pids, move it to per push function
    decision_with_pids = decision
                         |> Enum.map(&get_pid/1)
    fn -> collect_loop(decision_with_pids) end
  end

  defp get_pid({service, machine}) do
    node_name = Machine.node_name(machine)
    service_name = MDM.Service.get_name(service)
    {:ok, pid} = GenServer.call({MDMMinion.Deployer, node_name},
                                {:get_service_id, service_name})
    {MDM.Service.add_pid(service, pid), machine}
  end

  defp collect_loop(decision) do
    receive do
    after
      @interval ->
        metrics = get_metrics(decision)
        send_metrics(metrics)
        collect_loop(decision)
    end
  end

  defp get_metrics(decision) do
    decision
    |> Parallel.map(&get_metric/1)
    |> Parallel.map(&parse_metric/1)
  end

  defp get_metric({service, _}) do
    pid = MDM.Service.get_pid(service)
    {:ok, metrics} = GenServer.call(pid, :get_metrics)
    {service, metrics}
  end

  defp send_metrics(metrics) do
    payload = %{"services" => metrics}
    Event.new_event(:service_metrics, payload)
    |> EventPusher.push()
  end

  defp parse_metric({service, %{cpu: cpu, mem: mem, net: net}}) do
    cpu_m = parse_cpu(cpu)
    mem_m = parse_mem(mem)
    {net_in, net_out} = parse_net(net)
    metrics = %{"cpu" => cpu_m,
                "mem" => mem_m,
                "net_in" => net_in,
                "net_out" => net_out}
    %{"service_name" => MDM.Service.get_name(service), "metrics" => metrics}
  end

  defp parse_cpu(percent) do
    %{"is_ok" => true, "val" => percent, "unit" => "%"}
  end

  defp parse_mem(percent) do
    %{"is_ok" => true, "val" => percent, "unit" => "%"}
  end

  defp parse_net({:error, reason}) do
    {%{"is_ok" => false, "reason" => inspect(reason)},
     %{"is_ok" => false, "reason" => inspect(reason)}}
  end
  defp parse_net({net_in, net_out}) do
    {%{"is_ok" => true, "val" => net_in, "unit" => "KB/s"},
     %{"is_ok" => true, "val" => net_out, "unit" => "KB/s"}}
  end

end


