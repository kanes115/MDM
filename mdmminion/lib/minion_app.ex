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
    Supervisor.start_link(children(), strategy: :one_for_one)
  end


  defp children do
    [
      # It is a bit of a hack, but we won't ever
      # restart service processes now so we don't link
      # it to the supervisor. We could say they are almost
      # not supervised. We only kill them if the whole
      # application goes down. DyamicSupervisor does
      # not allow restart strategy :temporary :(
      {DynamicSupervisor,
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
