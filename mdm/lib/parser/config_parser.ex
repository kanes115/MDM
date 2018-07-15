defmodule MDM.JmmsrParser.ConfigParser do

    @available_metrics ["cpuUsage"] # TODO determine

    def check(%{"config" => conf}) do
      with :ok <- check_metrics(conf),
           :ok <- check_persist(conf),
           :ok <- check_pilot(conf), do: :ok
    end
    def check(_), do: {:error, :config_not_specified}

    defp check_metrics(%{"metrics" => metrics}) when is_list(metrics) do
      case Enum.all?(metrics, fn e -> Enum.member?(@available_metrics, e) end) do
        true -> :ok
        _ -> {:error, :unknown_metric}
      end
    end
    defp check_metrics(%{"metrics" => _}), do: {:error, :metrics_value_not_a_list}
    defp check_metrics(_), do: {:error, :metrics_not_found}

    defp check_persist(%{"persist" => true, "persist_machine" => id}) when is_integer(id), do: :ok
    defp check_persist(%{"persist" => true, "persist_machine" => _id}), do: {:error, :machine_id_not_int}
    defp check_persist(%{"persist" => false, "persist_machine" => _}) do
      #print warning
      :ok
    end
    defp check_persist(%{"persist" => false}), do: :ok
    defp check_persist(_), do: {:error, :persist_flag_not_set}

    defp check_pilot(%{"pilot_machine" => id}) when is_integer(id), do: :ok
    defp check_pilot(%{"pilot_machine" => _}), do: {:error, :machine_id_not_int}
    defp check_pilot(_), do: {:error, :pilot_not_set}

end
