defmodule MDMMinion.MDMMinionApp do
  use Application

  alias MDMMinion.InfoGatherer
  alias MDMMinion.Deployer
  alias MDMMinion.Router
  alias MDMMinion.NetworkInfo

  def start(_type, _args) do
    Application.ensure_all_started(:os_mon)
    Supervisor.start_link(children(), strategy: :one_for_one)
  end


  defp children do
    [
      %{
        id: NetworkInfo,
        start: {NetworkInfo, :start_link, []}
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
