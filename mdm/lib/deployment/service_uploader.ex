defmodule MDM.ServiceUploader do
  # TODO clean tmp files
  # TODO choose backend also (*.tar might not be ok for win)
  #      This time around we have to pick it according to
  #      target os
  use GenServer
  require Logger

  @type reason :: any()

  alias MDM.Machine
  alias MDM.Service

  @tmp_dir "/tmp/"
  
  defstruct uploaded_to: []

  ## API

  def start_link() do
    GenServer.start_link(__MODULE__, %__MODULE__{}, name: __MODULE__)
  end

  def upload_services(decision), do: GenServer.call(__MODULE__, {:upload_services, decision})
  
  ## GenServer callbacks
  def init(state) do
    ensure_tmp_dir_exists()
    {:ok, state}
  end

  def handle_call({:upload_services, decision}, _from, state), do: {:reply, do_upload_services(decision), state}
  
  def terminate(_, _state) do
    # TODO clean files
  end

  # Private
  
  def ensure_tmp_dir_exists do
    @tmp_dir |> File.dir? or File.mkdir(@tmp_dir)
  end

  @spec do_upload_services(DeployDecider.decision) :: :ok |
            {:error, {:fault_machines, [{:error, Machine.t, reason()}]}}
  def do_upload_services(decision) do
    res = decision
    |> Enum.map(fn {service, machine} -> upload_service(machine, service) end)
    |> Enum.filter(fn r -> elem(r, 0) == :error end)
    case res do
      [] -> :ok
      [_ | _] = fault ->
        {:error, {:fault_machines, fault}}
    end
  end

  defp upload_service(machine, service) do
    with {:ok, file_path} <- tar_service_dir(service),
         dest_node <- Machine.node_name(machine),
         :ok <- send_file_to_node(dest_node, file_path)
    do
      {:ok, machine}
    else
      error -> {:error, machine, error}
    end
  end

  defp tar_service_dir(service) do
    path = Service.get_service_path(service)
    suffix = service
             |> Service.get_name
    with {:ok, filenames0} <- File.ls(path),
         filenames <- filenames0 |> Enum.map(&Path.join(path, &1)) |> IO.inspect,
         tmp_file = tmp_file_path(suffix),
         :ok <- :erl_tar.create(tmp_file,
                                 Enum.map(filenames, &to_charlist/1)),
    do: {:ok, tmp_file}
  end

  defp tmp_file_path(suffix), do: @tmp_dir <> "service" <> suffix <> ".tar"

  defp send_file_to_node(dest_node, path) do
    file = File.open! path, [:read]
    Logger.info("sending message..")
    GenServer.call({MDMMinion.Deployer, dest_node}, {:save_file, file})
    :ok = File.close(file)
  end

end
