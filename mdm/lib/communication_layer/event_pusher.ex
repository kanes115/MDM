defmodule MDM.EventPusher do
  use GenServer

  def start_link do
    GenServer.start_link(__MODULE__, %{subscriptions: %{}}, name: __MODULE__)
  end

  def init(state) do
    {:ok, state}
  end

  @doc ""
  def subscribe(event_name) do
    pid = self()
    GenServer.call(__MODULE__, {:subscribe, pid, event_name})
  end

  def unsubscribe(event_name) do
    pid = self()
    GenServer.call(__MODULE__, {:unsubscribe, pid, event_name})
  end

  def push(event) do
    GenServer.call(__MODULE__, {:push_event, event})
  end

  def handle_call({:subscribe, pid, event_name}, _, %{subscriptions: subs}) do
    new_subs = subs
               |> Map.update(event_name,
                             [pid],
                             fn old_pids -> [pid | old_pids] end)
    {:reply, :ok, %{subscriptions: new_subs}}  
  end
  def handle_call({:unsubscribe, pid, event_name}, _, %{subscriptions: subs}) do
    new_subs =
    case Map.fetch(subs, event_name) do
      :error -> subs
      [^pid] -> Map.delete(subs, event_name)
      _ -> subs |> Map.update(event_name,
                              [],
                              fn old_pids -> old_pids -- [pid] end)
    end
    {:reply, :ok, %{subscriptions: new_subs}}  
  end
  def handle_call({:push_event, event} = push_msg, _, %{subscriptions: subs} = state) do
    case subs |> Map.fetch(event.event_name) do
      {:ok, pids} ->
        pids
        |> Enum.each(fn pid -> GenServer.cast(pid, push_msg) end)
      :error -> :ok
    end
    {:reply, :ok, state}
  end

end
