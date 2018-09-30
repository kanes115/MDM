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
  def handle_call(%Request{command_name: :deploy} = req, _, %__MODULE__{state: fsm, jmmsr: jmmsr} = state)
  when fsm == :collected_data do
    with {:ok, decision} <- MDM.DeployDecider.decide(jmmsr),
         :ok <- MDM.ServiceUploader.upload_services(decision),
         :ok <- MDM.ServiceUploader.run_services()
    do
      resp = req |> answer("deployed", 200, %{})
      {:reply, resp, state}
    else
      error ->
        Logger.error("Error when deploying:")
        IO.inspect error
        # TODO create a general error form for multi node errors
        # and parse it to json in one place
        resp = req |> error_answer(500, %{"reason" => inspect(error)})
        {:reply, resp, state}
    end
  end
  def handle_call(:get_state, _from, %{state: fsm} = state), do: {:reply, fsm, state}
  def handle_call(_, _, state), do: {:reply, :ok, state}


  def handle_info({:nodedown, _}, state) do
    {:noreply, %{state | state: :waiting_for_reqest}}
  end
  def handle_info(msg, state) do
    IO.inspect msg
    {:noreply, state}
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