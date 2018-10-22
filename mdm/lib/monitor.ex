defmodule MDM.Monitor do
  use GenServer

  alias MDM.Jmmsr
  alias MDM.Machine

  defstruct state: :waiting


  defmodule CollectMachineMetric do
    @interval 10_000 #ms

    def get_task(machines) do
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
      MDM.Event.new_event(:machine_metrics, payload)
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


  def start_link() do
    GenServer.start_link(__MODULE__, %__MODULE__{}, name: __MODULE__)
  end

  @spec start_monitoring_machines([Machine.t]) :: :ok
  def start_monitoring_machines(machines) do
    GenServer.call(__MODULE__, {:start_monitoring, machines})
  end

  def init(state) do
    {:ok, state}
  end


  def handle_call({:start_monitoring, machines}, _, %__MODULE__{state: :waiting}) do
    task = CollectMachineMetric.get_task(machines)
    Task.Supervisor.start_child(MDM.MonitorTasksSup, task)
    {:reply, :ok, %__MODULE__{state: :ignored}} # TODO
  end


end
