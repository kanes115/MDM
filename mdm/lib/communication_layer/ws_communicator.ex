defmodule MDM.WSCommunicator do
  use GenServer
  use Elixometer

  require Logger

  alias Socket.Web
  alias MDM.Command.Request
  alias MDM.Command.Response
  alias MDM.EventPusher

  @type comm_type :: :cast | :call

  @type command() :: atom()

  ## API

  # TODO in the future (when the need comes) we will subscribe
  # processes on certain `command_names` like `:deploy` or `metric_uppdate_request`
  # etc. Right now we have only one subscriber
  @spec start_link([{comm_type(), pid(), command()}]) ::
  {:ok, pid()} | :ignore | {:error, {:already_started, pid()} | term()}
  def start_link(subscriptions) do
    GenServer.start_link(__MODULE__, %{subscriptions: subscriptions, client: :no_client},
                         name: __MODULE__)
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
    update_counter("connections_got", 1)
    EventPusher.subscribe(:service_metrics)
    EventPusher.subscribe(:machine_metrics)
    EventPusher.subscribe(:service_down)
    me = self()
    spawn_link(fn -> spawn_receiver_fun(me, client) end)
    {:noreply, %{state | client: client}}
  end
  def handle_cast(:close, state) do
    EventPusher.unsubscribe(:service_metrics)
    EventPusher.unsubscribe(:machine_metrics)
    EventPusher.unsubscribe(:service_down)
    Logger.info("Closed connection...")
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
        Logger.info "Got command #{inspect(command.command_name)}"
        subs = get_subscribers(subs, command.command_name)
        subs == [] and Logger.warn "Nothing is subscribed to command #{inspect(command.command_name)}. Ignoring it"
        subs
        |> Enum.each(fn({comm_type, subscriber}) ->
          handle_request(client, subscriber, comm_type, command) end)
    end
    {:noreply, state}
  end
  def handle_cast({:push_event, event}, %{client: client} = state) do
    json = MDM.Event.to_json(event)
    client |> send_json(json)
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

  
  defp spawn_receiver_fun(forward_dest, client) do
    case client |> Socket.Web.recv do
      e when e == {:ok, :close} or e == {:ok, {:close, :going_away, ""}} ->
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
