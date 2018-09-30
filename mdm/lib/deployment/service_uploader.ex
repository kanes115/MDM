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
  
  defstruct uploaded_to: [], decision: nil

  ## API

  def start_link() do
    GenServer.start_link(__MODULE__, %__MODULE__{}, name: __MODULE__)
  end

  @spec upload_services(MDM.DeployDecider.decision()) :: :ok |
            {:error, {:fault_machines, [{:error, Machine.t, reason()}]}}
  def upload_services(decision), do: GenServer.call(__MODULE__, {:upload_services, decision})

  @spec run_services() ::  :ok |
            {:error, {:fault_machines, [{:error, Machine.t, reason()}]}}
  def run_services, do: GenServer.call(__MODULE__, :run_services)
  
  ## GenServer callbacks
  def init(state) do
    ensure_tmp_dir_exists()
    {:ok, state}
  end

  def handle_call({:upload_services, decision}, _from, s),
  do: {:reply, do_upload_services(decision), %{s | decision: decision}}
  def handle_call(:run_services, _from, %__MODULE__{decision: d} = s),
  do: {:reply, do_run_services(d), s}
  
  def terminate(_, _state) do
    # TODO clean files
  end

  # Private
  
  @spec do_run_services(DeployDecider.decision) :: :ok |
            {:error, {:fault_machines, [{:error, Machine.t, reason()}]}}
  defp do_run_services(decision) do
    decision
    |> foreach_service(&run_service/2)
  end

  @spec do_upload_services(DeployDecider.decision) :: :ok |
            {:error, {:fault_machines, [{:error, Machine.t, reason()}]}}
  defp do_upload_services(decision) do
    decision |>
    foreach_service(&upload_service/2)
  end

  defp foreach_service(decision, action) do
    res = decision
    |> Enum.map(fn {service, machine} -> action.(machine, service) end)
    |> Enum.filter(fn r -> elem(r, 0) == :error end)
    case res do
      [] -> :ok
      [_ | _] = fault ->
        {:error, {:fault_machines, fault}}
    end
  end

  defp run_service(machine, service) do
    dest_node = Machine.node_name(machine)
    service_name = Service.get_name(service)
    service_start_script_path = Service.get_service_executable(service)
    case GenServer.call({MDMMinion.Deployer, dest_node},
                        {:run_service, service_name, service_start_script_path}) do
                          :ok -> {:ok, machine}
      err -> err
                        end
  end

  defp upload_service(machine, service) do
    with {:ok, file_path} <- tar_service_dir(service),
         dest_node <- Machine.node_name(machine),
         service_name <- Service.get_name(service),
         :ok <- send_file_to_node(dest_node, file_path, service_name)
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
         filenames <- filenames0,# |> Enum.map(&Path.join(path, &1)),
         _ <- File.cd(path),
         tmp_file = tmp_file_path(suffix),
         :ok <- :erl_tar.create(tmp_file,
                                 Enum.map(filenames, &to_charlist/1)),
    do: {:ok, tmp_file}
  end

  defp tmp_file_path(suffix), do: @tmp_dir <> "service" <> suffix <> ".tar"

  defp send_file_to_node(dest_node, path, service_name) do
    file = File.open! path, [:read]
    Logger.info("sending message..")
    GenServer.call({MDMMinion.Deployer, dest_node},
                   {:save_file, file, service_name})
    :ok = File.close(file)
  end

  defp ensure_tmp_dir_exists,
  do: @tmp_dir |> File.dir? or File.mkdir(@tmp_dir)

end