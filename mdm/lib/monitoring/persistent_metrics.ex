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
    def create_machine_metric(machine_name, metric_name), do: {"gauges", "machines.#{machine_name}.#{metric_name}"}

    def create_service_metric(service_name, metric_name), do: {"gauges", "services.#{service_name}.#{metric_name}"}
  end


  # Uploader modules

  defmodule Machines do
    use Elixometer
    use GenServer

    def start_link,
      do: GenServer.start_link(__MODULE__, :ignored, name: __MODULE__)

    def init(state) do
      EventPusher.subscribe(:machine_metrics)
      {:ok, state}
    end


    def handle_cast({:push_event, %Event{event_name: :machine_metrics} = event}, state) do
      event.body["machines"]
      |> Enum.flat_map(
        fn %{"machine_name" => name, "metrics" => metrics} ->
          Commons.metrics_to_labels_and_values(metrics)
          |> Enum.map(fn {label, value} -> {Commons.create_machine_metric(name, label), value} end)
        end
      )
      |> Enum.map(fn {{_type, label}, value} -> update_gauge(label, value) end)
      {:noreply, state}
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

    def init(state) do
      EventPusher.subscribe(:service_metrics)
      {:ok, state}
    end

    # TODO extract common code. Probably key "service_name" could be just name.
    def handle_cast({:push_event, %Event{event_name: :service_metrics} = event}, state) do
      event.body["services"]
      |> Enum.filter(fn %{"is_down" => down?} -> not down? end)
      |> Enum.flat_map(
        fn %{"service_name" => name, "metrics" => metrics} ->
          Commons.metrics_to_labels_and_values(metrics)
          |> Enum.map(fn {label, value} -> {Commons.create_service_metric(name, label), value} end)
        end
      )
      |> Enum.map(fn {{_type, label}, value} -> update_gauge(label, value) end)
      {:noreply, state}
    end

    def terminate(reason, state) do
      EventPusher.unsubscribe(:machine_metrics)
    end
  end

  
end
