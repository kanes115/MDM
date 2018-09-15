defmodule MDMMinion.InfoGatherer do
  use GenServer

  def start_link(), do: GenServer.start_link(__MODULE__, :ignored, name: __MODULE__)

  def init(_), do: {:ok, :ignored}

  def handle_call(:get_info, _from, :ignored) do
    data = collect_data()
    {:reply, {:ok, data}, :ignored}
  end

  def collect_data() do
    %{
      cpu: "test"
    }
  end

end
