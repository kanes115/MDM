defmodule MDM.InfoGatherer do
  use GenServer

  require Logger

  def start_link do
    GenServer.start_link(__MODULE__,
                         %{machines: [], data: :not_collected}, name: __MODULE__)
  end

  def collect_data, do: GenServer.call(__MODULE__, :collect_data)

  def set_machines(machines), do: GenServer.call(__MODULE__, {:set_machines, machines})

  ## GenServer callbacks

  def init(state), do: {:ok, state}

  def handle_call({:set_machines, machines}, _from, state) do
    Logger.info("Connecting to minions on: #{machines |> Enum.map(&MDM.Machine.address/1) |> inspect}")
    addresses = machines |> Enum.map(&MDM.Machine.address/1)
    case connect_to_minions_nodes(addresses) do
      true ->
        {:reply, :ok, %{state | machines: machines}}
      fault_nodes ->
        {:reply, {:error, %{fault_nodes: fault_nodes}}, state}
    end
  end
  def handle_call(:collect_data, _from, %{machines: machines} = state) when is_list(machines) do
    nodes = machines
                |> Enum.map(&MDM.Machine.address/1)
                |> Enum.map(&node_name/1)
    results = for node_name <- nodes,
      do: GenServer.call({MDMMinion.InfoGatherer, node_name}, :get_info)
    results |> IO.inspect
    {:reply, {:ok, results}, state}
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
