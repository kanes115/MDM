defmodule MDMMinion.MDMMinionApp do
  use Application

  alias MDMMinion.Minion

  def start(_type, _args) do
    Supervisor.start_link(children(), strategy: :one_for_one)
  end


  defp children do
    [
      %{
        id: Minion,
        start: {Minion, :start_link, []}
      }
    ]
  end

end
