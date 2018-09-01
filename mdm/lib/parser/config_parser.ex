defmodule MDM.JmmsrParser.ConfigParser do

  require Logger
  alias MDM.JmmsrParser.Utils

  @behaviour MDM.JmmsrParser

  @available_metrics ["cpuUsage"] # TODO determine

  def check_typing(json) do
    with true <- Utils.check_values(json, ["config"],
                                    &is_map/1),
         true <- Utils.check_values(json, ["config", "metrics"],
                                    &Utils.list_of_strings?/1),
         true <- Utils.check_values(json, ["config", "metrics"],
                                    {&available_metric?/1, :unknown_metric}),
         true <- check_persist_machine(json),
         true <- Utils.check_values(json, ["config", "pilot_machine"],
                                    &is_integer/1), do: :ok
  end

  def check_relations(_), do: :ok

  defp check_persist_machine(json) do
    persist_machine_path = ["config", "persist_machine"]
    persist_path = ["config", "persist"]
    {:value, persist?} = json |> Utils.path(persist_path)
    case {persist?, Utils.path(json, persist_machine_path)} do
      {false, :not_found} -> true
      {false, _} -> 
        Logger.warn("Perist option set to false but persist_machine still defined")
        Utils.check_values(json, persist_machine_path, &is_integer/1)
      {true, :not_found} ->
        Logger.error("Perist option set to true but persist machine not provided")
        {false, persist_machine_path, :not_found}
      {true, _} ->
        Utils.check_values(json, persist_machine_path, &is_integer/1)
      {_, _} ->
        Utils.check_values(json, persist_path, &is_boolean/1)

    end
  end


  defp available_metric?(metrics) do
    metrics
    |> Enum.all?(fn m ->
      Enum.member?(@available_metrics, m) end)
  end

end
