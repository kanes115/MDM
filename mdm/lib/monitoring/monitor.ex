defmodule MDM.Monitor do
  require Logger
  alias MDM.Machine
  alias MDM.CollectMachineMetric
  alias MDM.CollectServicesMetric

  @callback get_task_fun(any()) :: (() -> any())

  defstruct machines_monitor: nil, service_monitor: nil

  def start_link do
    Logger.info "Starting monitor..."
    GenServer.start_link(__MODULE__, %__MODULE__{}, name: __MODULE__)
  end

  @spec stop_monitoring :: :ok
  def stop_monitoring,
    do: GenServer.call(__MODULE__, :stop_monitoring)

  @spec start_monitoring_machines([Machine.t]) :: :ok
  def start_monitoring_machines(machines),
    do: GenServer.call(__MODULE__, {:start_monitoring_machines, machines})

  @spec start_monitoring_services([[{MDM.Service, MDM.Machine}]]) :: :ok
  def start_monitoring_services(decision),
    do: GenServer.call(__MODULE__, {:start_monitoring_services, decision})


  def init(state), do: {:ok, state}

  def handle_call({:start_monitoring_machines, machines}, _, state) do
    task = CollectMachineMetric.get_task_fun(machines)
    {:ok, pid} = Task.Supervisor.start_child(MDM.MonitorTasksSup, task)
    {:reply, :ok, %{state | machines_monitor: pid}}
  end
  def handle_call({:start_monitoring_services, decision}, _, state) do
    task = CollectServicesMetric.get_task_fun(decision)
    {:ok, pid} = Task.Supervisor.start_child(MDM.MonitorTasksSup, task)
    {:reply, :ok, %{state | service_monitor: pid}}
  end
  def handle_call(:stop_monitoring, _, %{machines_monitor: m_pid, service_monitor: s_pid}) do
    Logger.info "Stopping monitoring"
    is_pid(m_pid) and Task.Supervisor.terminate_child(MDM.MonitorTasksSup, m_pid) |> IO.inspect
    is_pid(s_pid) and Task.Supervisor.terminate_child(MDM.MonitorTasksSup, s_pid) |> IO.inspect
    {:reply, :ok, %__MODULE__{}}
  end


end
