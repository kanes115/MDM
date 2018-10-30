defmodule MDMMinion.CPUInfo do
  use GenServer

  def start_link do
    GenServer.start_link(__MODULE__, :ignored, name: __MODULE__)
  end

  def init(_) do
    :cpu_sup.util
    {:ok, :ignore}
  end

  def handle_call(:get_cpu_usage, _, state) do
    # TODO maybe add probe time? for now we just execute
    # util twice in a row with now waiting
    :cpu_sup.util()
    {:reply, :cpu_sup.util(), state}
  end
end
