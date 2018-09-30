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
      {:ok, file_path} ->
        {:reply, :ok, update_services_here(s, service_name, file_path)}
      {:error, reason} ->
        {:reply, {:error, reason}, s}
    end
  end
  def handle_call({:run_service, name, start_script_path}, _from, %{backend: b} = s) do
    service_file = get_service_file(s, name)
    prepared_dir = b.prepare_service_files(service_file, name)
    b.run_service(prepared_dir, start_script_path)
    {:reply, :ok, s}
  end

  defp update_services_here(%{services_here: sh0} = state, s_name, file),
  do: %{state | services_here: Map.put(sh0, s_name, file)}

  defp get_service_file(%{services_here: sh}, s_name),
  do: sh[s_name]

  defp get_backend do
    case :os.type do
      {:unix, :linux} -> MDMMinion.LinuxDeployerBackend
      _ -> :undefined
    end
  end


end
