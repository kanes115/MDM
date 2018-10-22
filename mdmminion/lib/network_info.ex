defmodule MDMMinion.NetworkInfo do
  use GenServer

  @type reason :: atom

  @callback get_traffic_for_machine() :: {float(), float()} | {:error, reason} # KB/s

  def start_link do
    GenServer.start_link(__MODULE__, :ignored, name: __MODULE__)
  end

  def init(_) do
    {:ok, %{backend: get_backend()}}
  end

  def handle_call(:get_traffic_for_machine, _, %{backend: b} = state) do
    traffic = b.get_traffic_for_machine()
    {:reply, traffic, state}
  end

  defp get_backend do
    case :os.type do
      {:unix, :linux} -> MDMMinion.LinuxNetworkInfoBackend
      _ -> :undefined
    end
  end


end
