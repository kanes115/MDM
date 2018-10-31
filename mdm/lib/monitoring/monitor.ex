defmodule MDM.Monitor do
  alias MDM.Machine
  alias MDM.CollectMachineMetric
  alias MDM.CollectServicesMetric

  @callback get_task_fun(any()) :: (() -> any())

  defstruct state: :waiting

  @spec start_monitoring_machines([Machine.t]) :: :ok
  def start_monitoring_machines(machines) do
    task = CollectMachineMetric.get_task_fun(machines)
    Task.Supervisor.start_child(MDM.MonitorTasksSup, task)
    :ok
  end

  @spec start_monitoring_services([[{MDM.Service, MDM.Machine}]]) :: :ok
  def start_monitoring_services(decision) do
    task = CollectServicesMetric.get_task_fun(decision)
    Task.Supervisor.start_child(MDM.MonitorTasksSup, task)
    :ok
  end

end
