defmodule MDM.WSCommunicator do
  use GenServer

  require Logger

  alias Socket.Web
  alias MDM.Command.Request
  alias MDM.Command.Response

  @type comm_type :: :cast | :call

  ## API

  # TODO in the future (when the need comes) we will subscribe
  # processes on certain `command_names` like `:deploy` or `metric_uppdate_request`
  # etc. Right now we have only one subscriber
  @spec start_link({comm_type(), pid()}) ::
  {:ok, pid()} | :ignore | {:error, {:already_started, pid()} | term()}
  def start_link(subscriptions) do
    :dbg.tracer
    :dbg.tpl(__MODULE__, :get_subscribers, :x)
    :dbg.p(:all, :c)
    GenServer.start_link(__MODULE__, %{subscriptions: subscriptions, client: :no_client},
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
    Logger.info("Got connection...")
    me = self()
    spawn_link(fn -> spawn_receiver_fun(me, client) end)
    {:noreply, %{state | client: client}}
  end
  def handle_cast(:close, state) do
    Web.close(state.client)
    GenServer.cast(self(), :wait_for_conn)
    {:noreply, %{state | client: :no_client}}
  end
  def handle_cast({:handle_msg, msg}, %{client: client, subscriptions: subs} = state) do
    case map_to_command(msg) do
      {:error, reason} ->
        resp = Response.response_command_malformed(%{reason: inspect(reason)})
        send_json(client, resp |> Response.to_json)
      command ->
        get_subscribers(subs, command.command_name)
        |> Enum.each(fn({comm_type, subscriber}) ->
          handle_request(client, subscriber, comm_type, command) end)
    end
    {:noreply, state}
  end

  defp get_subscribers(subscriptions, command) do
    subscriptions
    |> Enum.filter(fn {_, _, commands} ->
      Enum.member?(commands, command) end)
    |> Enum.map(fn {comm_type, subscriber, _} -> {comm_type, subscriber} end)
  end

  defp handle_request(_, sub, :cast, command), do: GenServer.cast(sub, command)
  defp handle_request(client, sub, :call, command) do
    resp = GenServer.call(sub, command)
    do_send_answer(client, resp)
  end

  def handle_call({:send_answer, answer}, _from, %{client: client} = state) do
    {:reply, do_send_answer(client, answer), state}
  end

  defp spawn_receiver_fun(forward_dest, client) do
    case client |> Socket.Web.recv do
      e when e == {:ok, :close} or e == {:ok, {:close, :going_away, ""}} ->
        Logger.info("Closed connection...")
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
      reason -> {:error, reason}
    end

  end

  defp do_send_answer(client, answer) do
    case Response.to_json(answer) do
      {:error, reason} ->
        # Should not happen
        Logger.warn("Trying to send to client malformed json. Sending error instead")
        resp = %{reason: "Server tried to send malformed answer: #{inspect(reason)}"}
               |> Response.response_internal_error()
        client |> send_json(resp |> Response.to_json)
        :error
      resp ->
        client |> send_json(resp)
        :ok
    end
  end

  defp send_json(client, map) do
    {:ok, string} = map |> Poison.encode
    client |> Web.send!({:text, string})
  end

end
