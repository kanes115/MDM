defmodule MDM.Deployer do
  use GenServer

  alias MDM.WSCommunicator
  alias MDM.Command
  alias MDM.JmmsrParser

  def start_link() do
    res = GenServer.start_link(__MODULE__, :state, name: __MODULE__)
    GenServer.cast(__MODULE__, :wait)
    res
  end

  def init(_) do
    {:ok, :state}
  end

  def handle_cast(:wait, _) do
    receive do
      %Command.Request{command_name: :deploy, body: jmmsr0} = req ->
        case JmmsrParser.check_correctness(jmmsr0) do
          :ok ->
            jmmsr = jmmsr0 |> JmmsrParser.to_internal_repr
            machines = jmmsr[:machines]
            # We will maybe sending in body back some diff of jmmsr with machines info.
            # TODO we have to establish some common protocol for DIFFs.
            #
            # TODO
            # For now we only answer OK back
            req
            |> Command.Response.new_answer("ok", 200, %{})
            |> WSCommunicator.send_answer
            :ok
          {:error, path, reason} ->
            req
            |> Command.Response.error_response(400, %{"path" => path, "reason" => reason})
            |> WSCommunicator.send_answer
        end
    end
    GenServer.cast(__MODULE__, :wait)
    {:noreply, :state}
  end

end
