defmodule MDM.MDMApp do
  use Application

  alias MDM.WSCommunicator
  alias MDM.Deployer

  def start(_type, _args) do
    Supervisor.start_link(children(), strategy: :one_for_one)
  end


  defp children do
    [
      %{
        id: WSCommunicator,
        start: {WSCommunicator, :start_link, [Deployer]}
      },
      %{
        id: Deployer,
        start: {Deployer, :start_link, []}
      }
    ]
  end

end
