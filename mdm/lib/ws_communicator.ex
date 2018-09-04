defmodule MDM.WSCommunicator do
  use GenServer

  require Logger

  alias Socket.Web
  alias MDM.Command.Request
  alias MDM.Command.Response

  ## API

  # TODO in the future (when the need comes) we will subscribe
  # processes on certain `command_names` like `:deploy` or `metric_uppdate_request`
  # etc. Right now we have only one subscriber
  @spec start_link(pid()) ::
  {:ok, pid()} | :ignore | {:error, {:already_started, pid()} | term()}
  def start_link(subscriber) do
    GenServer.start_link(__MODULE__, %{subscriber: subscriber, client: :no_client},
                         name: __MODULE__)
  end

  @spec send_answer(Response.t) :: :ok | :error
  def send_answer(%Response{} = resp) do
    GenServer.call(__MODULE__, {:send_answer, resp})
  end

  ## GenServer callbacks

  def init(state) do
    server = Web.listen! 8080
    GenServer.cast(self(), :wait_for_conn)
    {:ok, Map.put(state, :server, server)}
  end

  def handle_cast(:wait_for_conn, %{server: server} = state) do
    client = server |> Web.accept!
    client |> Web.accept! # we always accept for now
    me = self()
    spawn_link(fn -> spawn_receiver_fun(me, client) end)
    {:noreply, %{state | client: client}}
  end
  def handle_cast(:close, state) do
    Web.close(state.client)
    GenServer.cast(self(), :wait_for_conn)
    {:noreply, %{state | client: :no_client}}
  end
  def handle_cast({:handle_msg, msg}, %{client: client, subscriber: sub} = state) do
    case map_to_command(msg) do
      :error ->
        send_json(client, Response.error_response(400))
      command ->
        send sub, command
    end
    {:noreply, state}
  end

  def handle_call({:send_answer, answer}, _from, %{client: client} = state) do
    case Response.to_json(answer) do
      :error ->
        # Should not happen
        Logger.warn("Trying to send to client malformed json. Sending error instead")
        client |> send_json(Response.error_response(500))
        {:reply, :error, state}
      resp ->
        client |> send_json(resp)
        {:reply, :ok, state}
    end
  end

  defp spawn_receiver_fun(forward_dest, client) do
    case client |> Socket.Web.recv do
      {:ok, :close} ->
        GenServer.cast(forward_dest, :close)
      {:ok, msg} ->
        GenServer.cast(forward_dest, {:handle_msg, msg})
        spawn_receiver_fun(forward_dest, client)
    end
  end

  defp map_to_command({:text, text}) do
    with {:ok, res} <- Poison.decode(text),
         %Request{} = command <- Request.from_json(res)
    do
      command
    else
      _ -> :error
    end

  end

  defp send_json(client, map) do
    {:ok, string} = map |> Poison.encode
    client |> Web.send!({:text, string})
  end

end
