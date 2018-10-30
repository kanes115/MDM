defmodule MDMMinion.CPUInfo do
  use GenServer

  @probe_time 200 #ms

  def start_link do
    GenServer.start_link(__MODULE__, :ignored, name: __MODULE__)
  end

  def init(_) do
    :cpu_sup.util
    {:ok, :ignore}
  end

  def handle_call(:get_cpu_usage, _, state) do
    # TODO maybe collect those info in background and return
    # last collected? Applies to all monitoring
    :cpu_sup.util()
    :timer.sleep(@probe_time)
    {:reply, :cpu_sup.util(), state}
  end
end
