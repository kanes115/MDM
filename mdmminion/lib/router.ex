defmodule MDMMinion.Router do
  use GenServer
  # TODO clean up
  
  # mapping of addresses from `from` to `to`
  @callback register_routes({from :: String.t, to :: String.t})
  :: :ok | {:error, reason :: any()}

  def start_link,
  do: GenServer.start_link(__MODULE__, :ignore, name: __MODULE__)

  ## GenSErver callbacks

  def init(_) do
    b = get_backend()
    {:ok, %{backend: b}}
  end

  def handle_call({:register_routes, routes}, _, %{backend: b} = s),
    do: {:reply, b.register_routes(routes), s}

  ## Private
  defp get_backend do
    case :os.type do
      {:unix, :linux} -> MDMMinion.LinuxRouterBackend
      _ -> :undefined
    end
  end

end
