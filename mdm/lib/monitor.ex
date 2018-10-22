defmodule MDM.Monitor do
  use GenServer

  alias MDM.Jmmsr
  alias MDM.Machine
  alias MDM.CollectMachineMetric

  @callback get_task_fun(any()) :: (() -> any())

  defstruct state: :waiting

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
    task = CollectMachineMetric.get_task_fun(machines)
    Task.Supervisor.start_child(MDM.MonitorTasksSup, task)
    {:reply, :ok, %__MODULE__{state: :ignored}} # TODO
  end


end
