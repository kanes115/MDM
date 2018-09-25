defmodule MDM.MDMApp do
  use Application

  alias MDM.WSCommunicator
  alias MDM.Deployer
  alias MDM.InfoGatherer

  def start(_type, _args) do
    Supervisor.start_link(children(), strategy: :one_for_one, name: __MODULE__)
  end


  defp children do
    [
      %{
        id: WSCommunicator,
        start: {WSCommunicator, :start_link, [{:call, Deployer}]}
      },
      %{
        id: Deployer,
        start: {Deployer, :start_link, []}
      },
      %{
        id: InfoGatherer,
        start: {InfoGatherer, :start_link, []}
      }
    ]
  end

end
