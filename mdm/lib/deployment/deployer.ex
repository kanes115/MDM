defmodule MDM.Deployer do
  use GenServer

  require Logger

  alias MDM.Command.Request
  alias MDM.Command.Response
  alias MDM.InfoGatherer

  @type state() :: :waiting_for_reqest | :collected_data | :deployed
  @type t :: %__MODULE__{state: state()}

  defstruct [:state, :jmmsr]

  def start_link() do
    GenServer.start_link(__MODULE__, %__MODULE__{state: :waiting_for_reqest}, name: __MODULE__)
  end

  def commands do
    [:collect_data, :deploy, :stop_system]
  end

  # Test API
  def get_state, do: GenServer.call(__MODULE__, :get_state)


  def init(state) do
    {:ok, state}
  end


  # We will maybe sending in body back some diff of jmmsr with machines info.
  # TODO we have to establish some common protocol for DIFFs.
  def handle_call(%Request{command_name: :collect_data, body: jmmsr0} = req, _, %__MODULE__{state: fsm} = state) 
  when fsm == :waiting_for_reqest or fsm == :collected_data do
    Logger.info("Got request to collect target machines info...")
    with {:ok, jmmsr} <- MDM.Jmmsr.new(jmmsr0),
         :ok <- connect_to_machines(jmmsr),
         {:ok, data} <- InfoGatherer.collect_data()
    do
      Logger.info("parsed JMMSR:")
      IO.inspect(jmmsr)
      parsed_data = Enum.map(data, &parse_collecting_result/1)
      resp = req |> answer("collected", 200, %{"collected_data" => parsed_data})
      {:reply, resp, %{state | state: :collected_data, jmmsr: jmmsr}}
    else
      {:error, %{fault_nodes: nodes}} ->
      Logger.error("Could not connect to nodes: #{inspect(nodes)}")
        resp = req |> error_answer(500, %{"reason" => "Can't connect to nodes", "fault_nodes" => inspect(nodes)})
        {:reply, resp, %{state | state: :waiting_for_reqest}}
      {:error, path, reason} ->
        resp = req |> error_answer(400, %{"path" => path, "reason" => reason})
        {:reply, resp, %{state | state: :waiting_for_reqest}}
    end
  end
  def handle_call(%Request{command_name: :deploy} = req, _, %__MODULE__{state: :collected_data, jmmsr: jmmsr} = state) do
    Logger.info("Deploying the system...")
    with {:ok, decision} <- MDM.DeployDecider.decide(jmmsr),
         :ok <- MDM.ServiceUploader.upload_services(decision),
         :ok <- MDM.ServiceUploader.prepare_routes(),
         :ok <- MDM.ServiceUploader.run_services()
    do
      resp = req |> answer("deployed", 200, %{})
      MDM.Monitor.start_monitoring_machines(jmmsr |> MDM.Jmmsr.get_machines)
      MDM.Monitor.start_monitoring_services(decision)
      {:reply, resp, %{state | state: :deployed}}
    else
      error ->
        Logger.error("Error when deploying: #{inspect(error)}")
        # TODO create a general error form for multi node errors
        # and parse it to json in one place
        resp = req |> error_answer(500, %{"reason" => inspect(error)})
        {:reply, resp, state}
    end
  end
  def handle_call(%Request{command_name: :stop_system} = req, _, %{state: :deployed} = state) do
    Logger.info "Stopping the system"
    MDM.Monitor.stop_monitoring() |> IO.inspect
    body = 
      MDM.ServiceUploader.stop_services() # might return fault nodes(?)
      |> stop_result_to_body()
    #    MDM.ServiceUploader.clean_service_files()
    resp = req |> answer("stopped", 200, %{"stopped_services" => body})
    {:reply, resp, %{state | state: :collected_data}}
  end
  def handle_call(%Request{command_name: :collect_data} = req, _, %{state: :deployed} = state) do
    resp = req |> error_answer(423, %{"reason" => "System is already deployed. Can't collect data now."})
    {:reply, resp, state}
  end

  defp handle_cast({:service_down, name}, state) do
    # TODO if gui is not connected we have to create
    # an API for gathering information after reconnection
    # Now information about down services is not available
    # on connecting
    Logger.warn "Service #{name} went down"
    MDM.Event.new_event(:service_down, %{service_name: name})
    |> MDM.EventPusher.push
  end

  def handle_info({:nodedown, _}, state) do
    {:noreply, %{state | state: :waiting_for_reqest}}
  end
  def handle_info(msg, state) do
    IO.inspect msg
    {:noreply, state}
  end

  defp stop_result_to_body(service_results) do
    stop_result_to_body(service_results, [])
  end

  defp stop_result_to_body([], acc), do: acc
  defp stop_result_to_body([{service, {:ok, :forced}} | rest], acc) do
    [%{"service_name" => MDM.Service.get_name(service), "status" => "forced"} | acc]
    ++ stop_result_to_body(rest)
  end
  defp stop_result_to_body([{service, {:ok, {:status, status}}} | rest], acc) do
    [%{"service_name" => MDM.Service.get_name(service), "status" => status} | acc]
    ++ stop_result_to_body(rest)
  end
  defp stop_result_to_body([{service, {:ok, {:signal, signal}}} | rest], acc) do
    [%{"service_name" => MDM.Service.get_name(service), "signal" => signal} | acc]
    ++ stop_result_to_body(rest)
  end

  defp parse_collecting_result({:error, machine}), do: %{"machine" => machine, "ok?" => false}
  defp parse_collecting_result(machine), do: %{"machine" => MDM.Machine.to_map(machine), "ok?" => true}

  defp connect_to_machines(jmmsr) do
    InfoGatherer.subscribe_to_events(self())
    jmmsr
    |> MDM.Jmmsr.get_machines
    |> InfoGatherer.set_machines
  end

  defp answer(req, msg, code, body) do
      req |> Response.new_answer(msg, code, body)
  end

  defp error_answer(req, code, body) do
    req
    |> Response.error_response(code, body)
  end

end
