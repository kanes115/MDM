defmodule MDMMinion.Service do
  use GenServer
  require Logger

  alias MDMMinion.BackendNif

  @type dir :: String.t
  @type id :: any()

  @log_dir "/mdm_logs"

  @callback get_cpu_usage(id()) :: integer()

  defstruct [:backend,
             :name,
             :service_dir,
             :exec_path,
             :id,
             :alive?,
             :exit_status,
             :report_down_to]

  @doc "Exec path is relative to service dir"
  def start(name, service_dir, exec_path, report_down_to) do
    b = get_backend()
    File.mkdir(@log_dir)
    state = %__MODULE__{backend: b,
                        name: name,
                        service_dir: service_dir,
                        exec_path: exec_path,
                        report_down_to: report_down_to}
    GenServer.start(__MODULE__, state)
  end


  def init(state) do
    log_path = get_log_path(state.name)
    {:ok, _pid, os_pid} = :exec.run(state.exec_path |> bash_execution |> to_charlist,
                   [
                    {:cd, state.service_dir |> to_charlist},
                    {:stdout, log_path |> to_charlist, []},
                    {:stderr, log_path |> to_charlist, []},
                    {:group, 0},
                    :monitor,
                    :kill_group,
                    {:kill_timeout, 5}
                   ])
    Logger.info("Service #{state.name} started with os pid #{os_pid}")
    {:ok, %__MODULE__{state | alive?: true, id: os_pid}}
  end

  def bash_execution(script_path), do: ". ./#{script_path}"

  def handle_call(:get_metrics, _, %{alive?: true} = state) do
    cpu_usage = state.backend.get_cpu_usage(state.id)
    mem_usage = state.backend.get_mem_usage(state.id)
    net_usage = state.backend.get_net_usage(state.id)
    metric = %{cpu: cpu_usage, mem: mem_usage, net: net_usage}
    {:reply, {:ok, metric}, state}
  end
  def handle_call(:get_metrics, _, %{alive?: false} = state) do
    {:reply, {:error, :service_down}, state}
  end
  def handle_call(:stop, _, %{alive?: true} = state) do
    case :exec.stop_and_wait(state.id, 6000) do
      {:error, :timeout} ->
        Logger.info "Service #{state.name} (id #{state.id}) is being stopped... (killed)"
        {:stop, :normal, {:ok, :forced}, %{state | alive?: false}}
      status ->
        Logger.info "Service #{state.name} (os_pid #{state.id}) is being stopped... (exit_status: #{inspect(status_parse(status))})"
        {:stop, :normal, {:ok, status_parse(status)},  %{state | alive?: false}}
    end
  end
  def handle_call(:stop, _, state) do
    {:stop, :normal, {:ok, state.exit_status}, state}
  end

  def handle_info({:DOWN, _, :process, _, status}, state) do
    code = status_parse(status)
    Logger.info "Service #{state.name} (id #{state.id}) stopping... (exit_status: #{inspect(code)})"
    # We inform pilot Deployer that this service went down unexpectedly
    GenServer.cast(state.report_down_to, {:service_down, state.name, code})
    {:noreply, %{state | alive?: false, exit_status: code}}
  end

  defp status_parse(:normal), do: {:status, 0}
  defp status_parse({:exit_status, code}) do
    status_parse(code)
  end
  defp status_parse(code) when is_integer(code) do
    case :exec.status(code) do
      {:status, status} ->
        {:status, status}
      {:signal, signal, _} ->
        {:signal, signal}
    end
  end

  def terminate(:normal, state),
  do: Logger.warn "Service #{state.name} process is terminating (id #{state.id}) with reason :normal"
  def terminate(reason, state),
  do: Logger.warn "Service #{state.name} process is terminating (id #{state.id}) with reason #{inspect(reason)}"

  defp get_log_path(service_name) do
    log_file_name = service_name <> "_log.log"
    Path.join(@log_dir, log_file_name)
  end

  def backend(%__MODULE__{backend: b}), do: b

  def get_backend() do
    case :os.type do
      {:unix, :linux} -> MDMMinion.LinuxDeployerBackend
      _ -> :undefined
    end
  end
end
