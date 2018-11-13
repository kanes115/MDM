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
             :exit_status]

  @doc "Exec path is relative to service dir"
  def start_link([name, service_dir, exec_path]) do
    b = get_backend()
    File.mkdir(@log_dir)
    state = %__MODULE__{backend: b,
                        name: name,
                        service_dir: service_dir,
                        exec_path: exec_path}
    GenServer.start_link(__MODULE__, state)
  end


  def init(state) do
    #Process.flag(:trap_exit, true)
    log_path = get_log_path(state.name)
    {:ok, _pid, os_pid} = :exec.run(state.exec_path |> bash_execution |> to_charlist,
                   [
                    {:cd, state.service_dir |> to_charlist},
                    {:stdout, log_path |> to_charlist, []},
                    {:stderr, log_path |> to_charlist, []},
                    {:group, 0},
                    :monitor
                   ])
    # os_pid is the same as pgid so we treat it as id
    Logger.info("Service #{state.name} started with os pid #{os_pid}")
    {:ok, %__MODULE__{state | alive?: true, id: os_pid}}
  end

  def bash_execution(script_path), do: "./#{script_path}"

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
    case :exec.stop_and_wait(state.id, 4800) do
      {:error, :timeout} ->
        {:stop, :normal, {:ok, :forced}, %{state | alive?: false}}
      status ->
        {:stop, :normal, {:ok, status2int(status)},  %{state | alive?: false}}
    end
  end
  def handle_call(:stop, _, state) do
    {:stop, :normal, {:ok, state.exit_status}, state}
  end

  def handle_info({:DOWN, _, :process, _, status}, state) do
    code = status2int(status)
    Logger.warn "Service #{state.name} (id #{state.id}) stopping... (exit_status: #{code})"
    {:noreply, %{state | alive?: false, exit_status: code}}
  end

  defp status2int(:normal), do: 0
  defp status2int({:exit_status, code}), do: code
  defp status2int(code) when is_integer(code), do: code

  def terminate(:normal, state),
  do: Logger.warn "Service #{state.name} (id #{state.id}) stopping... (reason: normal"

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
