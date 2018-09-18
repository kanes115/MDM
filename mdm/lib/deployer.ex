defmodule MDM.Deployer do
  use GenServer

  require Logger

  alias MDM.WSCommunicator
  alias MDM.Command
  alias MDM.JmmsrParser
  alias MDM.InfoGatherer

  @type state() :: :waiting_for_reqest | :collected_data | :deployed
  @type t :: %__MODULE__{state: state()}

  defstruct [:state]

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
  def handle_call(%Command.Request{command_name: :collect_data, body: jmmsr0} = req, _, %__MODULE__{state: fsm} = state) 
  when fsm == :waiting_for_reqest or fsm == :collected_data do
    Logger.info("Got request to collect target machines info...")
    with :ok <- JmmsrParser.check_correctness(jmmsr0),
         jmmsr <- JmmsrParser.to_internal_repr(jmmsr0),
         :ok <- connect_to_machines(jmmsr),
         {:ok, data} <- collect_data()
    do
      resp = req |> answer("WIP collected", 200, %{"collected_data" => inspect(data)})
      {:reply, resp, %{state | state: :collected_data}}
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
  def handle_call(%Command.Request{command_name: :deploy, body: _jmmsr0} = req, _, %__MODULE__{state: fsm} = state)
  when fsm == :collected_data do
    #TODO
    resp = req |> error_answer(501, %{"reason" => "feature not implemented"})
    {:reply, resp, state}
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

  defp connect_to_machines(jmmsr) do
    InfoGatherer.subscribe_to_events(self())
    jmmsr[MDM.Machine.key]
    |> InfoGatherer.set_machines
  end

  defp collect_data do 
    data = InfoGatherer.collect_data
           |> IO.inspect
    {:ok, data}
  end

  # TODO maybe use calls and don't send replies directly here
  # but in WSCommunicator?
  defp answer(req, msg, code, body) do
      req |> Command.Response.new_answer(msg, code, body)
  end

  defp error_answer(req, code, body) do
    req
    |> Command.Response.error_response(code, body)
  end

end
