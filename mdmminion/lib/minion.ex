defmodule MDMMinion.Minion do
  use GenServer

  alias InfoGatherer

  def start_link() do
    GenServer.start_link(__MODULE__, :state, name: __MODULE__)
  end

  ## GenServer callbacks

  def init() do
    {:ok, :state}
  end

  def handle_call(:get_info, _from, :state) do
    {:reply, InfoGatherer.get_info(), :state}
  end

end
