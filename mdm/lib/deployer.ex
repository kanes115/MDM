defmodule MDM.Deployer do
  use GenServer

  alias MDM.WSCommunicator

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
      e ->
        IO.puts "got: #{inspect(e)}"
        IO.puts "replying..."
        e
        |> MDM.Command.Response.new_answer("echoing", 200, %{})
        |> WSCommunicator.send_answer
    end
    GenServer.cast(__MODULE__, :wait)
    {:noreply, :state}
  end

end
