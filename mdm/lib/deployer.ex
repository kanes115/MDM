defmodule MDM.Deployer do
  use GenServer

  def start_link() do
    res = GenServer.start_link(__MODULE__, :state, name: __MODULE__)
    GenServer.cast(__MODULE__, :wait)
    res
  end

  def init(_) do
    {:ok, :state}
  end

  def handle_cast(:wait, _) do
    receive do
      e -> IO.inspect e
    end
    {:noreply, :state}
  end

end
