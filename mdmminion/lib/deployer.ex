defmodule MDMMinion.Deployer do
  use GenServer
  require Logger

  @type reason :: atom() # TODO be more specific

  @callback save_file(File.io_device(), prefix :: String.t) ::
  :ok | {:error, reason()}
  @callback start() :: :ok | {:error, reason()}


  def start_link() do
    GenServer.start_link(__MODULE__, :ignore, name: __MODULE__)
  end

  ## GenServer callbacks

  def init(_) do
    b = get_backend()
    # TODO what if unknown backend?
    b.start()
    {:ok, %{backend: b, services_here: %{}}}
  end

  def handle_call({:save_file, file, service_name}, _from, %{backend: b} = s) do
    case b.save_file(file, service_name) do
      {:ok, _bytes_copied} ->
        {:reply, :ok, update_services_here(s, service_name, file)}
      {:error, reason} ->
        {:reply, {:error, reason}, s}
    end
  end
  def handle_call(:run_service, _from, %{backend: b} = s) do
  end

  defp update_services_here(%{services_here: sh0}, s_name, file) do
    Map.put(sh0, s_name, file)
  end

  defp get_backend do
    case :os.type do
      {:unix, :linux} -> MDMMinion.LinuxDeployerBackend
      _ -> :undefined
    end
  end


end
