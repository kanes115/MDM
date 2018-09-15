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

  def handle_call(:get_state, _from, %{state: fsm} = state), do: {:reply, fsm, state}

  def init(state) do
    {:ok, state}
  end


  # We will maybe sending in body back some diff of jmmsr with machines info.
  # TODO we have to establish some common protocol for DIFFs.
  def handle_cast(%Command.Request{command_name: :collect_data, body: jmmsr0} = req, %__MODULE__{state: fsm} = state) 
  when fsm == :waiting_for_reqest or fsm == :collected_data do
    Logger.info("Got request to collect target machines info...")
    with :ok <- JmmsrParser.check_correctness(jmmsr0),
         jmmsr <- JmmsrParser.to_internal_repr(jmmsr0),
         :ok <- connect_to_machines(jmmsr),
         {:ok, data} <- collect_data()
    do
      req
      |> Command.Response.new_answer("WIP collected", 200, %{"collected_data" => inspect(data)})
      |> WSCommunicator.send_answer
    else
      {:error, %{fault_nodes: nodes}} ->
      Logger.error("Could not connect to nodes: #{inspect(nodes)}")
        req
        |> Command.Response.error_response(500, %{"reason" => "Can't connect to nodes",
          "fault_nodes" => inspect(nodes)})
        |> WSCommunicator.send_answer
        {:noreply, %{state | state: :waiting_for_reqest}}
      {:error, path, reason} ->
        req
        |> Command.Response.error_response(400, %{"path" => path, "reason" => reason})
        |> WSCommunicator.send_answer
        {:noreply, %{state | state: :waiting_for_reqest}}
    end
    {:noreply, %{state | state: :collected_data}}
  end
  def handle_cast(%Command.Request{command_name: :deploy, body: _jmmsr0} = req, %__MODULE__{state: fsm} = state)
  when fsm == :collected_data do
    #TODO
    req
    |> Command.Response.error_response(501, %{"reason" => "feature not implemented"})
    |> WSCommunicator.send_answer
    {:noreply, state}
  end
  def handle_cast(_, state), do: {:noreply, state}


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

end
