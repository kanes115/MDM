defmodule MDM.PersistentMetrics do

  require Logger

  alias MDM.EventPusher
  alias MDM.Event

  # Common functions

  defmodule Commons do
    def metrics_to_labels_and_values(metrics) do
      metrics
      |> Enum.reduce([],
                     fn {label, metric}, acc ->
                       parse_metric(label, metric) ++ acc end)
    end

    defp parse_metric(label, %{"is_ok" => true, "val" => val}), do: [{label, val}]
    defp parse_metric(_, _), do: []

    # We only have gauge now
    def create_machine_metric(system_name, machine_name, metric_name),
    do: {"gauges", "#{escape_name(system_name)}.machines.#{machine_name}.#{metric_name}"}

    def create_service_metric(system_name, service_name, metric_name),
    do: {"gauges", "#{escape_name(system_name)}.services.#{service_name}.#{metric_name}"}

    defp escape_name(name), do: String.replace(name, " ", "-")
  end


  # Uploader modules

  defmodule Machines do
    use Elixometer
    use GenServer

    def start_link,
      do: GenServer.start_link(__MODULE__, :ignored, name: __MODULE__)

    def set_system_name(name), do: GenServer.call(__MODULE__, {:set_name, name})

    def init(state) do
      EventPusher.subscribe(:machine_metrics)
      {:ok, state}
    end

    def handle_call({:set_name, name}, _, _), do: {:reply, :ok, name}

    def handle_cast({:push_event, %Event{event_name: :machine_metrics} = event}, system_name) do
      event.body["machines"]
      |> Enum.flat_map(
        fn %{"machine_name" => name, "metrics" => metrics} ->
          Commons.metrics_to_labels_and_values(metrics)
          |> Enum.map(fn {label, value} -> {Commons.create_machine_metric(system_name, name, label), value} end)
        end
      )
      |> Enum.map(fn {{_type, label}, value} -> update_gauge(label, value) end)
      {:noreply, system_name}
    end

    def terminate(reason, state) do
      EventPusher.unsubscribe(:machine_metrics)
    end


  end

  defmodule Services do
    use Elixometer
    use GenServer

    def start_link,
      do: GenServer.start_link(__MODULE__, :ignored, name: __MODULE__)

    def set_system_name(name), do: GenServer.call(__MODULE__, {:set_name, name})

    def init(state) do
      EventPusher.subscribe(:service_metrics)
      {:ok, state}
    end

    def handle_call({:set_name, name}, _, _), do: {:reply, :ok, name}

    # TODO extract common code. Probably key "service_name" could be just name.
    def handle_cast({:push_event, %Event{event_name: :service_metrics} = event}, system_name) do
      event.body["services"]
      |> Enum.filter(fn %{"is_down" => down?} -> not down? end)
      |> Enum.flat_map(
        fn %{"service_name" => name, "metrics" => metrics} ->
          Commons.metrics_to_labels_and_values(metrics)
          |> Enum.map(fn {label, value} -> {Commons.create_service_metric(system_name, name, label), value} end)
        end
      )
      |> Enum.map(fn {{_type, label}, value} -> update_gauge(label, value) end)
      {:noreply, system_name}
    end

    def terminate(reason, state) do
      EventPusher.unsubscribe(:machine_metrics)
    end
  end

  
end
