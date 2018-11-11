defmodule MDMMinion.MDMMinionApp do
  use Application

  alias MDMMinion.InfoGatherer
  alias MDMMinion.Deployer
  alias MDMMinion.Router
  alias MDMMinion.NetworkInfo
  alias MDMMinion.CPUInfo
  alias MDMMinion.ServiceSup

  def start(_type, _args) do
    Application.ensure_all_started(:os_mon)
    Application.ensure_all_started(:exec_app)
    #:exec.start([])
    Supervisor.start_link(children(), strategy: :one_for_one)
  end


  defp children do
    [
      {DynamicSupervisor,
        max_restarts: 3,
        max_seconds: 60, # practically infinity
        strategy: :one_for_one,
        name: ServiceSup},
      %{
        id: NetworkInfo,
        start: {NetworkInfo, :start_link, []}
      },
      %{
        id: CPUInfo,
        start: {CPUInfo, :start_link, []}
      },
      %{
        id: InfoGatherer,
        start: {InfoGatherer, :start_link, []}
      },
      %{
        id: Deployer,
        start: {Deployer, :start_link, []}
      },
      %{
        id: Router,
        start: {Router, :start_link, []}
      }
    ]
  end

end
