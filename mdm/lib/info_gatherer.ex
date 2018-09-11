defmodule MDM.InfoGatherer do
  use GenServer

  require Logger

  def start_link(machines) do
    GenServer.start_link(__MODULE__,
                         %{machines: machines, nodes_reported: []}, name: __MODULE__)
  end

  def collect_data, do: GenServer.call(__MODULE__, :collect_data)

  ## GenServer callbacks

  def init(%{machines: machines} = state) do
    Logger.info("Connecting to minions on: #{machines |> Enum.map(&MDM.Machine.address/1) |> inspect}")
    addresses = machines |> Enum.map(&MDM.Machine.address/1)
    case connect_to_minions_nodes(addresses) do
      true ->
        {:ok, state}
      fault_nodes ->
        {:stop, %{fault_nodes: fault_nodes}}
    end
  end

  def handle_cast({:info, from_node, info},
                  %{machines: machines, nodes_reported: reported}) do
    Logger.info("Waiting for information on machines from minions...")
    new_machines = update_machine_with_info(from_node, machines, info)
    {:noreply, %{machines: new_machines, nodes_reported: [from_node, reported]}}
  end

  def handle_call(:collect_data, _from, %{machines: machines} = state) do
    nodes = machines
                |> Enum.map(&MDM.Machine.address/1)
                |> Enum.map(&node_name/1)
    data = :rpc.multicall(nodes, MDMMinion.InfoGatherer, :get_info, [])
           |> IO.inspect
    {:reply, {:ok, data}, state}
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
