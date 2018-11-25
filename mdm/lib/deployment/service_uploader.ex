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
  alias MDM.Utils.Parallel

  @tmp_dir "/tmp/"
  
  defstruct uploaded_to: [], decision: nil, decision: nil

  ## API

  def start_link() do
    GenServer.start_link(__MODULE__, %__MODULE__{}, name: __MODULE__)
  end

  def report_services_down_to(machines, pid) do
    machines
    |> Enum.map(fn machine ->
      GenServer.call({MDMMinion.Deployer, MDM.Machine.node_name(machine)},
                     {:report_services_down_to, pid}) end)
    :ok
  end

  @spec upload_services(MDM.DeployDecider.decision()) :: :ok |
            {:error, {:fault_machines, [{:error, Machine.t, reason()}]}}
  def upload_services(decision),
  do: GenServer.call(__MODULE__, {:upload_services, decision})

  def prepare_routes, do: GenServer.call(__MODULE__, :prepare_routes)

  def stop_services, do: GenServer.call(__MODULE__, :stop_services)

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
  def handle_call(:prepare_routes, _from, %__MODULE__{decision: d} = s),
  do: {:reply, do_prepare_routes(d), s}
  def handle_call(:run_services, _from, %__MODULE__{decision: d} = s),
  do: {:reply, do_run_services(d), s}
  def handle_call(:stop_services, _from, %__MODULE__{decision: d} = s),
  do: {:reply, do_stop_services(d), s}
  
  def terminate(_, _state) do
    # TODO clean files
  end

  # Private

  defp do_prepare_routes(decision) do
    routes =
    decision
    |> Enum.map(fn {s, m} -> {Machine.address(m), Service.get_name(s)} end)
    results = decision
          |> Enum.map(fn {_, machine} -> 
            node_name = Machine.node_name(machine)
            {GenServer.call({MDMMinion.Router, node_name}, {:register_routes, routes}), machine} end)
    res = Enum.filter(results, fn r -> elem(r, 0) == :error end)
    case res do
      [] -> :ok
      _ -> {:error, {:fault_machines, res}}
    end
  end
  
  @spec do_run_services(DeployDecider.decision) :: :ok |
            {:error, {:fault_machines, [{:error, Machine.t, reason()}]}}
  defp do_run_services(decision) do
    decision
    |> foreach_service(&run_service/2)
  end

  @spec do_stop_services(DeployDecider.decision) :: :ok |
            {:error, {:fault_machines, [{:error, Machine.t, reason()}]}}
  def do_stop_services(decision) do
    decision
    |> Parallel.map(fn {service, machine} -> {MDM.Service.fetch_pid(machine, service), machine} end)
    |> Parallel.map(&stop_service/1)
  end

  @spec do_upload_services(DeployDecider.decision) :: :ok |
            {:error, {:fault_machines, [{:error, Machine.t, reason()}]}}
  defp do_upload_services(decision) do
    decision |>
    foreach_service(&upload_service/2)
  end

  defp foreach_service(decision, action) do
    res = decision
    |> Parallel.map(fn {service, machine} -> action.(machine, service) end)
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

  @spec stop_service({MDM.Service.t, MDM.Machine.t})
  :: {MDM.Service.t, {:ok, :forced | {:status, integer()} | {:signal, integer()}}}
  defp stop_service({service, machine}) do
    service_pid = MDM.Service.get_pid(service)
    {service, GenServer.call(service_pid, :stop)}
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
    with {:ok, filenames} <- File.ls(path),
         tmp_file = tmp_file_path(suffix),
         :ok <- :zip.create(tmp_file,
                            Enum.map(filenames, &to_charlist/1),
                            [{:cwd, path |> to_charlist}]),
    do: {:ok, tmp_file}
  end

  defp tmp_file_path(suffix), do: @tmp_dir <> "service" <> suffix <> ".zip"

  defp send_file_to_node(dest_node, path, service_name) do
    file = File.open! path, [:read]
    GenServer.call({MDMMinion.Deployer, dest_node},
                   {:save_file, file, service_name})
    :ok = File.close(file)
  end

  defp ensure_tmp_dir_exists,
  do: @tmp_dir |> File.dir? or File.mkdir(@tmp_dir)

end
