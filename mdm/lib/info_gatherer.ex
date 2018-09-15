defmodule MDM.InfoGatherer do
  use GenServer

  require Logger

  def start_link do
    GenServer.start_link(__MODULE__,
                         %{machines: [], data: :not_collected, subscriber: nil}, name: __MODULE__)
  end

  def collect_data, do: GenServer.call(__MODULE__, :collect_data)

  def set_machines(machines), do: GenServer.call(__MODULE__, {:set_machines, machines})

  def subscribe_to_events(pid), do: GenServer.call(__MODULE__, {:subscribe_to_events, pid})

  ## GenServer callbacks

  def init(state), do: {:ok, state}

  def handle_call({:set_machines, machines}, _from, state) do
    Logger.info("Connecting to minions on: #{machines |> Enum.map(&MDM.Machine.address/1) |> inspect}")
    addresses = machines |> Enum.map(&MDM.Machine.address/1)
    case connect_to_minions_nodes(addresses) do
      true ->
        for node_name <- Node.list, do: Node.monitor(node_name, true)
        {:reply, :ok, %{state | machines: machines}}
      fault_nodes ->
        {:reply, {:error, %{fault_nodes: fault_nodes}}, %{state | machines: machines}}
    end
  end
  def handle_call(:collect_data, _from, %{machines: machines} = state) when is_list(machines) do
    nodes = machines
                |> Enum.map(&MDM.Machine.address/1)
                |> Enum.map(&node_name/1)
    Logger.info("Trying to collect data from machines: #{inspect(machines)}...")
    Logger.info("Trying to collect data from minions: #{inspect(nodes)}...")
    results = for node_name <- nodes,
      do: GenServer.call({MDMMinion.InfoGatherer, node_name}, :get_info)
    {:reply, {:ok, results}, state}
  end
  def handle_call({:subscribe_to_events, pid}, _from, state) do
    {:reply, :ok, %{state | subscriber: pid}}
  end


  def handle_info({:nodedown, minion}, state) do
    send state.subscriber, {:nodedown, minion}
    Logger.error("Lost connection with #{inspect(minion)}")
    # TODO keep information in state about fault nodes
    {:noreply, state}
  end

  ## Helpers

  defp update_machine_with_info(_, _, _), do: [] # TODO

  defp connect_to_minions_nodes(addresses) do
    nodes = for a <- addresses, do: Node.connect(node_name(a))
    nodes_results = nodes
                    |> Enum.zip(addresses)
    case Enum.all?(nodes_results, fn {connected?, _} -> connected? end) do
      true -> true
      false -> unconnected_nodes(nodes_results)
    end
  end

  defp unconnected_nodes(nodes) do
    nodes
    |> Enum.filter(fn {connected?, _} -> not connected? end)
    |> Enum.map(fn {_, node_name} -> node_name end)
  end

  defp node_name(address) do
    "minion@#{address}" |> String.to_atom
  end

end
