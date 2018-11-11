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
             :id]

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
    log_path = get_log_path(state.name)
    {:ok, _pid, os_pid} = :exec.run_link(state.exec_path |> bash_execution |> to_charlist,
                   [
                    {:cd, state.service_dir |> to_charlist},
                    {:stdout, log_path |> to_charlist, []},
                    {:stderr, log_path |> to_charlist, []},
                    {:group, 0},
                    :monitor
                   ])
                   #:exec.setpgid(os_pid, id) |> IO.inspect
    Logger.info("Service #{state.name} started with os pid #{os_pid}")
    {:ok, %__MODULE__{state | id: os_pid}}
  end

  def bash_execution(script_path), do: "./#{script_path}"

  def handle_call(:get_metrics, _, state) do
    cpu_usage = state.backend.get_cpu_usage(state.id)
    mem_usage = state.backend.get_mem_usage(state.id)
    net_usage = state.backend.get_net_usage(state.id)
    metric = %{cpu: cpu_usage, mem: mem_usage, net: net_usage}
    {:reply, {:ok, metric}, state}
  end

  def handle_info(reason, state) do
    Logger.warn "Service #{state.name} (id #{state.id}) stopping..."
    {:noreply, state}
  end

  def terminate(reason, state) do
    Logger.info "Stopping #{__MODULE__} for service #{state.name} with id #{state.id}. Reason: #{inspect(reason)}"
  end

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
