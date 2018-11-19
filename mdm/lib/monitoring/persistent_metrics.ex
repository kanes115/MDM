defmodule MDM.PersistentMetrics do
  use Elixometer
  use GenServer

  require Logger

  alias MDM.EventPusher
  alias MDM.Event

  def start_link,
    do: GenServer.start_link(__MODULE__, :ignored, name: __MODULE__)

  def init(state) do
    EventPusher.subscribe(:machine_metrics)
    :dbg.tracer
    :dbg.tpl(Elixometer.Utils, :x)
    :dbg.p(:all, :c)
    #EventPusher.subscribe(:service_metrics)
    {:ok, state}
  end


  def handle_cast({:push_event, %Event{event_name: :machine_metrics} = event}, state) do
    machines_prefix = "machines"
    event.body["machines"]
    |> Enum.flat_map(
      fn %{"machine_name" => name, "metrics" => metrics} ->
        metric_prefix = "#{machines_prefix}.#{name}"
        metrics_to_labels_and_values(metrics)
        |> Enum.map(fn {label, value} -> {"#{metric_prefix}.#{label}", value} end)
      end
      )
      |> Enum.map(fn {label, value} -> update_gauge(label, value) end)
    {:noreply, state}
  end

  def terminate(reason, state) do
    EventPusher.unsubscribe(:machine_metrics)
  end

  defp metrics_to_labels_and_values(metrics) do
    metrics
    |> Enum.reduce([],
                   fn {label, metric}, acc ->
                     parse_metric(label, metric) ++ acc end)
  end

  defp parse_metric(label, %{"is_ok" => true, "val" => val}), do: [{label, val}]
  defp parse_metric(_, _), do: []

end
