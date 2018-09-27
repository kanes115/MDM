defmodule MDM.JmmsrParser.LiveMetricsParser do

  alias MDM.JmmsrParser.Utils

  @behaviour MDM.JmmsrParser

  # TODO
  @metrics ["cpu", "mem", "net"]

  def check_typing(json) do
    with true <- Utils.check_values(json, ["live_metrics"],
                                    &is_list/1),
         true <- Utils.check_values(json, ["live_metrics", "for_machine"],
                                    &is_boolean/1),
         true <- check_id(json),
         true <- Utils.check_values(json, ["live_metrics", "value"],
                                    &is_integer/1),
         true <- Utils.check_values(json, ["live_metrics", "metric"],
                                    {&metric?/1, :unknown_metric}), do: :ok
  end

  def check_relations(json) do
    with true <- check_relations_wth_services(json),
         true <- check_relations_wth_machines(json), do: :ok
  end

  defp check_relations_wth_machines(json) do
    defined_machines = json
                       |> Utils.path(["machines", "id"])
                       |> Utils.unpack
                       |> Utils.unpack
    metric_services = json
                      |> Utils.path(["live_metrics", "machine_id"])
                      |> Utils.unpack
                      |> Enum.filter(fn e -> e !== :not_found end)
                      |> Utils.unpack
    metric_services
    |> Enum.map(fn s -> 
      to_undefined_error(Enum.member?(defined_machines, s), :machine) 
    end)
    |> Utils.take_first_error
  end


  defp check_relations_wth_services(json) do
    defined_services = json
                       |> Utils.path(["services", "name"])
                       |> Utils.unpack
                       |> Utils.unpack
    metric_services = json
                      |> Utils.path(["live_metrics", "service_name"])
                      |> Utils.unpack
                      |> Enum.filter(fn e -> e !== :not_found end)
                      |> Utils.unpack
    metric_services
    |> Enum.map(fn s -> 
      to_undefined_error(Enum.member?(defined_services, s), :service) 
    end)
    |> Utils.take_first_error
  end

  defp to_undefined_error(true, _), do: true
  defp to_undefined_error(false, :service), do: {false, ["live_metrics"], :undefined_service}
  defp to_undefined_error(false, :machine), do: {false, ["live_metrics"], :undefined_machine}

  defp metric?(metric), do: Enum.member?(@metrics, metric)

  defp check_id(json) do
    {:value, metrics} = Utils.path(json, ["live_metrics"])
    metrics
    |> Enum.map(&correct_id?/1)
    |> Utils.take_first_error
  end

  defp correct_id?(metric) do
      for_machine? = Map.get(metric, "for_machine")
      {correct_key, wrong_key} = for_machine_to_keys(for_machine?)
      correct_val = Map.get(metric, correct_key)
      wrong_val = Map.get(metric, wrong_key)
      case {correct_val, wrong_val} do
        {nil, _} -> {false, ["live_metrics", correct_key], :not_found}
        {e, nil} -> has_correct_type?(e, correct_key)
        {_, _} -> {false, ["live_metrics", wrong_key], :should_not_be_specified}
      end
  end

  defp has_correct_type?(val, "machine_id") when is_integer(val), do: true
  defp has_correct_type?(val, "service_name") when is_bitstring(val), do: true
  defp has_correct_type?(_, key), do: {false, ["live_metrics", key], :type_mismatch}

  defp for_machine_to_keys(true), do: {"machine_id", "service_name"}
  defp for_machine_to_keys(false), do: {"service_name", "machine_id"}

end
