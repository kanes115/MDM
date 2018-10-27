defmodule MDMMinion.Service do
  use GenServer

  alias MDMMinion.BackendNif

  @type dir :: String.t
  @type id :: any()

  @log_dir "/mdm_logs"

  @callback run_service(dir(), dir()) :: id()

  defstruct [:name,
             :service_dir,
             :exec_path,
             :id]

  @doc "Exec path is relative to service dir"
  def start_link([name, service_dir, exec_path]) do
    File.mkdir!(@log_dir)
    state = %__MODULE__{name: name,
                        service_dir: service_dir,
                        exec_path: exec_path}
    GenServer.start_link(__MODULE__, state)
  end


  def init(state) do
    log_path = get_log_path(state.name)
    id = BackendNif.run_service(state.service_dir |> to_charlist,
                                state.exec_path |> to_charlist,
                                log_path |> to_charlist)
    {:ok, %__MODULE__{state | id: id}}
  end

  defp get_log_path(service_name) do
    log_file_name = service_name <> "_log.log"
    Path.join(@log_dir, log_file_name)
  end
end
