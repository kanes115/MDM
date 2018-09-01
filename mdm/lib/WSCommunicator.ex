defmodule WSCommunicator do
  use GenServer

  alias Socket.Web

  ## API

  def start_link(subscriber) do
    GenServer.start_link(__MODULE__, %{subscriber: subscriber, client: :no_client},
                         name: __MODULE__)
  end

  def init(state) do
    GenServer.cast(self(), :wait_for_conn)
    {:ok, state}
  end

  def send_answer(%Command.Response{} = resp) do
    GenServer.call(__MODULE__, {:send_answer, resp})
  end

  ## GenServer callbacks

  def handle_cast(:wait_for_conn, state) do
    server = Web.listen! 8080
    client = server |> Web.accept!
    client |> Web.accept! # we always accept for now
    me = self()
    spawn_link(fn -> spawn_receiver_fun(me, client) end)
    {:noreply, %{state | client: client}}
  end
  def handle_cast({:handle_msg, msg}, %{client: client, subscriber: sub} = state) do
    case map_to_command(msg) do
      :error ->
        send_json(client, %{"code" => 400, "msg" => "error"})
      command ->
        send sub, command
    end
    {:noreply, state}
  end

  def handle_call({:send_answer, answer}, _from, %{client: client} = state) do
    case Command.Response.to_json(answer) do
      :error ->
        client |> send_json(%{"code" => 500, "msg" => "error"})
        throw(:unexpected_error_when_parsing)
      resp ->
        client |> send_json(resp)
    end
    {:reply, :ok, state}
  end

  defp spawn_receiver_fun(forward_dest, client) do
    msg = client |> Socket.Web.recv!
    GenServer.cast(forward_dest, {:handle_msg, msg})
    spawn_receiver_fun(forward_dest, client)
  end

  defp map_to_command({:text, text}) do
    with {:ok, res} <- Poison.decode(text),
         %Command.Request{} = command <- Command.Request.from_json(res)
    do
      command
    else
      :error -> :error
    end

  end

  defp send_json(client, map) do
    {:ok, string} = map |> Poison.encode
    client |> Web.send!({:text, string})
  end

end