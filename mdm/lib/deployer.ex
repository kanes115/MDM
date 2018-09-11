defmodule MDM.Deployer do
  use GenServer

  alias MDM.WSCommunicator
  alias MDM.Command
  alias MDM.JmmsrParser
  alias MDM.InfoGatherer

  def start_link() do
    GenServer.start_link(__MODULE__, :state, name: __MODULE__)
  end

  def init(_) do
    {:ok, :state}
  end


  # We will maybe sending in body back some diff of jmmsr with machines info.
  # TODO we have to establish some common protocol for DIFFs.
  def handle_cast(%Command.Request{command_name: :deploy, body: jmmsr0} = req, state) do
    with :ok <- JmmsrParser.check_correctness(jmmsr0),
         {:ok, _} <- start_gatherer(jmmsr0)
    do
      connect_info(req)
    else
      {:error, {%{fault_nodes: nodes}, _}} ->
        req
        |> Command.Response.error_response(500, %{"reason" => "Can't connect to nodes",
          "fault_nodes" => inspect(nodes)})
        |> WSCommunicator.send_answer
      {:error, path, reason} ->
        req
        |> Command.Response.error_response(400, %{"path" => path, "reason" => reason})
        |> WSCommunicator.send_answer
    end
    {:noreply, state}
  end


  def handle_info(msg, state) do
    IO.inspect msg
    {:noreply, state}
  end

  defp start_gatherer(jmmsr0) do
    jmmsr = jmmsr0 |> JmmsrParser.to_internal_repr
    machines = jmmsr[MDM.Machine.key]
    Supervisor.start_child(MDM.MDMApp, %{
      id: InfoGatherer,
      start: {InfoGatherer, :start_link, [machines]}
    })
  end

  defp connect_info(req) do 
    data = InfoGatherer.collect_data
           |> IO.inspect
    req
    |> Command.Response.new_answer("WIP deployed", 200, %{"TODO" =>
      inspect(data)})
    |> WSCommunicator.send_answer
  end

end
