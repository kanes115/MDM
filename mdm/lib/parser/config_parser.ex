defmodule MDM.JmmsrParser.ConfigParser do

  alias MDM.JmmsrParser.Utils

  @available_metrics ["cpuUsage"] # TODO determine

  def check(%{"config" => conf}) when is_map(conf) do
    with :ok <- check_metrics(conf),
         :ok <- check_persist(conf),
         :ok <- check_pilot(conf), do: :ok
  end
  def check(%{"config" => _}), do: {:error, Utils.type_error_message("config", "object")}
  def check(_), do: {:error, "config not specified"}

  defp check_metrics(%{"metrics" => metrics}) when is_list(metrics) do
    case Enum.all?(metrics, fn e -> Enum.member?(@available_metrics, e) end) do
      true -> :ok
      _ -> {:error, :unknown_metric}
    end
  end
  defp check_metrics(%{"metrics" => _}), do: {:error, Utils.type_error_message("metrics", "list")}
  defp check_metrics(_), do: {:error, "metrics not found"}

  defp check_persist(%{"persist" => true} = config) do
    Utils.specified_int(config, "persist_machine", "perist_machine")
  end
  defp check_persist(%{"persist" => false} = config) do
    Utils.if_specified_warn(config, "persist_machine", 
                            "Option `persist` was false but `persist_machine` still defined")
    :ok
  end
  defp check_persist(_), do: {:error, "persist flag not set"}

  defp check_pilot(config), do: Utils.specified_int(config, "pilot_machine", "pilot machine")

end
