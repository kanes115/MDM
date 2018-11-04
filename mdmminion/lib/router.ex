defmodule MDMMinion.Router do
  use GenServer
  # TODO clean up
  require Logger
  
  # mapping of addresses from `from` to `to`
  @callback register_routes({from :: String.t, to :: String.t})
  :: :ok | {:error, reason :: any()}

  def start_link do
    Logger.info "Starting #{__MODULE__}"
    GenServer.start_link(__MODULE__, :ignore, name: __MODULE__)
  end

  ## GenSErver callbacks

  def init(_) do
    b = get_backend()
    {:ok, %{backend: b}}
  end

  def handle_call({:register_routes, routes}, _, %{backend: b} = s),
    do: {:reply, b.register_routes(routes), s}


  def terminate(reason, state),
    do: Logger.info "Stopping #{__MODULE__}. Reason: #{inspect(reason)}"

  ## Private
  defp get_backend do
    case :os.type do
      {:unix, :linux} -> MDMMinion.LinuxRouterBackend
      _ -> :undefined
    end
  end

end
