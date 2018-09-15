defmodule MDMMinion.MDMMinionApp do
  use Application

  alias MDMMinion.InfoGatherer

  def start(_type, _args) do
    Supervisor.start_link(children(), strategy: :one_for_one)
  end


  defp children do
    [
      %{
        id: InfoGatherer,
        start: {InfoGatherer, :start_link, []}
      }
    ]
  end

end
