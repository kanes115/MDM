defmodule MDMMinion.Deployer do
  use GenServer
  require Logger

  alias MDMMinion.ServiceSup
  alias MDMMinion.Service

  @type reason :: atom() # TODO be more specific

  @callback save_file(File.io_device(), prefix :: String.t) ::
  :ok | {:error, reason()}
  @callback start() :: :ok | {:error, reason()}


  def start_link() do
    Logger.info "Starting #{__MODULE__}"
    GenServer.start_link(__MODULE__, :ignore, name: __MODULE__)
  end

  ## GenServer callbacks

  def init(_) do
    b = get_backend()
    # TODO what if unknown backend?
    b.start()
    {:ok, %{backend: b, services_here: %{}, run_services: %{}, report_service_down_to: nil}}
  end

  def handle_call({:report_services_down_to, pid}, _, state), do: {:reply, :ok, %{state | report_service_down_to: pid}}
  def handle_call({:save_file, file, service_name}, _from, %{backend: b} = s) do
    case b.save_file(file, service_name) do
      {:ok, file_path} ->
        prepared_dir = b.prepare_service_files(file_path, service_name)
        {:reply, :ok, update_services_here(s, service_name, prepared_dir)}
      {:error, reason} ->
        Logger.error "Error when saving file for service #{service_name} for reason #{reason}"
        {:reply, {:error, reason}, s}
    end
  end
  def handle_call({:run_service, name, start_script_path}, _from, %{backend: b} = s) do
    service_file = get_service_file(s, name) #TODO it's service dir not file (be more specific)
    ensure_service_permissions(service_file, start_script_path)
    child_spec = %{id: Service,
      start: {Service, :start, [name, service_file, start_script_path, s.report_service_down_to]}}
    {:ok, pid}
    = DynamicSupervisor.start_child(ServiceSup, child_spec)
    {:reply, :ok, update_run_services(s, name, pid)}
  end
  def handle_call({:get_service_id, service_name}, _, %{run_services: services} = s) do
    {:reply, {:ok, services[service_name]}, s}
  end

  def terminate(reason, state),
    do: Logger.info "Stopping #{__MODULE__}. Reason: #{inspect(reason)}"

  defp update_services_here(%{services_here: sh0} = state, s_name, file),
  do: %{state | services_here: Map.put(sh0, s_name, file)}

  defp update_run_services(%{run_services: sh0} = state, s_name, pid),
  do: %{state | run_services: Map.put(sh0, s_name, pid)}

  defp get_service_file(%{services_here: sh}, s_name),
  do: sh[s_name]

  defp ensure_service_permissions(service_file, start_script_path),
  do: File.chmod(Path.join(service_file, start_script_path), 755)


  defp get_backend do
    case :os.type do
      {:unix, :linux} -> MDMMinion.LinuxDeployerBackend
      _ -> :undefined
    end
  end


end
