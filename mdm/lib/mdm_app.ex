defmodule MDM.MDMApp do
  use Application

  alias MDM.WSCommunicator
  alias MDM.Deployer
  alias MDM.InfoGatherer
  alias MDM.ServiceUploader
  alias MDM.CorrectnessChecker
  alias MDM.MonitorTasksSup
  alias MDM.Monitor
  alias MDM.EventPusher
  alias MDM.PersistentMetrics


  def start(_type, _args) do
    MDM.Dashboard.init
    Supervisor.start_link(children(), strategy: :one_for_one, name: __MODULE__)
  end


  defp children do
    [
      %{
        id: EventPusher,
        start: {EventPusher, :start_link, []}
      },
      %{
        id: WSCommunicator,
        start: {WSCommunicator, :start_link,
          [[{:call, Deployer, Deployer.commands()},
            {:call, CorrectnessChecker, CorrectnessChecker.commands()}]]}
      },
      %{
        id: CorrectnessChecker,
        start: {CorrectnessChecker, :start_link, []}
      },
      %{
        id: PersistentMetrics.Machines,
        start: {PersistentMetrics.Machines, :start_link, []}
      },
      %{
        id: PersistentMetrics.Services,
        start: {PersistentMetrics.Services, :start_link, []}
      },
      %{
        id: Deployer,
        start: {Deployer, :start_link, []}
      },
      %{
        id: Monitor,
        start: {Monitor, :start_link, []}
      },
      %{
        id: ServiceUploader,
        start: {ServiceUploader, :start_link, []}
      },
      %{
        id: InfoGatherer,
        start: {InfoGatherer, :start_link, []}
      },
      {Task.Supervisor, name: MonitorTasksSup}
    ]
  end

end
