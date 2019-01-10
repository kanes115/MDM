defmodule MDM.CollectServicesMetric do
  require Logger
  @behaviour MDM.Monitor

  @moduledoc """
  This is a module to monitor resources of the whole target machine.
  """

  alias MDM.Event
  alias MDM.EventPusher
  alias MDM.Utils.Parallel

  def interval, do: Application.get_env(:mdm, :live_metrics_report_interval, 2000)

  def get_task_fun(decision) do
    # if we want to have fresher pids, move it to per push function
    decision_with_pids = decision
                         |> Enum.map(&get_pid/1)
    fn -> collect_loop(decision_with_pids) end
  end

  defp get_pid({service, machine}) do
    {MDM.Service.fetch_pid(machine, service), machine}
  end

  defp collect_loop(decision) do
    receive do
    after
      interval() ->
        metrics = get_metrics(decision)
        send_metrics(metrics)
        collect_loop(decision)
    end
  end

  defp get_metrics(decision) do
    decision
    |> Parallel.map(&get_metric_timed/1)
    |> Parallel.map(&parse_metric/1)
  end

  defp get_metric_timed(decision_el) do
    {time, val} =
    :timer.tc(fn() -> get_metric(decision_el) end)
    case time > 5000 * 1000 do
      true -> Logger.warn "Call for metrics lasted long! (time: #{time / 1000})"
      false -> :ok
    end
    val
  end

  defp get_metric({service, _}) do
    pid = MDM.Service.get_pid(service)
    case GenServer.call(pid, :get_metrics, :infinity) do
      {:ok, metrics} ->
        {service, metrics}
      {:error, :service_down} ->
        {:error, service, :service_down}
    end
  end

  defp send_metrics(metrics) do
    payload = %{"services" => metrics}
    Event.new_event(:service_metrics, payload)
    |> EventPusher.push()
  end

  defp parse_metric({:error, service, :service_down}) do
    %{"service_name" => MDM.Service.get_name(service), "is_down" => true}
  end
  defp parse_metric({service, %{cpu: cpu, mem: mem, net: net}}) do
    cpu_m = parse_cpu(cpu)
    mem_m = parse_mem(mem)
    {net_in, net_out} = parse_net(net)
    metrics = %{"cpu" => cpu_m,
                "mem" => mem_m,
                "net_in" => net_in,
                "net_out" => net_out}
    %{"service_name" => MDM.Service.get_name(service), "metrics" => metrics, "is_down" => false}
  end

  defp parse_cpu({:error, reason}) do
    %{"is_ok" => false, "reason" => inspect(reason)}
  end
  defp parse_cpu(percent) do
    %{"is_ok" => true, "val" => percent, "unit" => "%"}
  end

  defp parse_mem({:error, reason}) do
    %{"is_ok" => false, "reason" => inspect(reason)}
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


