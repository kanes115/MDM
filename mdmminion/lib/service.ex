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
    File.mkdir!(@log_dir)
    state = %__MODULE__{backend: b,
                        name: name,
                        service_dir: service_dir,
                        exec_path: exec_path}
    GenServer.start_link(__MODULE__, state)
  end


  def init(state) do
    log_path = get_log_path(state.name)
    {:ok, id} = BackendNif.run_service(state.service_dir |> to_charlist,
                                state.exec_path |> to_charlist,
                                log_path |> to_charlist)
    Logger.info("Service started with session id #{id}")
    {:ok, %__MODULE__{state | id: id}}
  end

  def handle_call(:get_metrics, _, state) do
    cpu_usage = state.backend.get_cpu_usage(state.id)
    mem_usage = state.backend.get_mem_usage(state.id)
    net_usage = state.backend.get_net_usage(state.id)
    metric = %{cpu: cpu_usage, mem: mem_usage, net: net_usage}
    {:reply, {:ok, metric}, state}
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
