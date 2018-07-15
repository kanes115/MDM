defmodule MDM.JmmsrParser.ServicesParser do

  alias MDM.JmmsrParser.Utils

  def check(%{"services" => services}) when is_list(services) do
    results = for s <- services, do: {s, check_service(s)}
    case Utils.take_first_error(results) do
      :ok -> :ok
      {service, {:error, reason}} -> 
        {:error, %{trouble_entry: service, reason: reason}}
    end
  end
  def check(%{"services" => _}), do: {:error, Utils.type_error_message("serivces", "list")}
  def check(_), do: {:error, :services_undefined}

  defp check_service(service) do
    with :ok <- check_name(service),
         :ok <- check_dirs(service),
         :ok <- check_containerized(service),
         :ok <- check_reqs(service), do: :ok
  end

  defp check_name(s), do: Utils.specified_string(s, "name", "service name")

  defp check_dirs(s) do
    with :ok <- Utils.specified_path(s, "service_dir", "service_dir"),
         :ok <- Utils.specified_path(s, "service_executable", "service_executable"), do: :ok
  end

  defp check_containerized(s), do: Utils.specified_bool(s, "containerized", "containerized")

  defp check_reqs(%{"requirements" => r}) when is_map(r) do
    with :ok <- check_os(r),
         :ok <- check_resources(r),
         :ok <- check_available_machines(r), do: :ok
  end
  defp check_reqs(%{"requirements" => _}), 
  do: {:error, Utils.type_error_message("requirements", "object")}
  defp check_reqs(_), do: {:error, "requirements not specified"}


  defp check_os(%{"os" => oses}) when is_list(oses) do
    case Enum.all?(oses, fn os -> Enum.member?(Utils.supported_oses(), os) end) do
      true -> :ok
      false -> {:error, "unsupported os"}
    end
  end
  defp check_os(%{"os" => _}), do: {:error, Utils.type_error_message("os", "list")}
  defp check_os(_), do: :ok

  defp check_resources(r) do
    with :ok <- Utils.if_specified_int(r, "RAM", "RAM"),
         :ok <- Utils.if_specified_int(r, "HDD", "HDD"), do: :ok
  end

  defp check_available_machines(%{"available_machines" => am}) when is_list(am) do
    case Enum.all?(am, fn m -> is_integer(m) end) do
      true -> :ok
      false -> {:error, Utils.type_error_message("one of available machines", "integer")}
    end
  end
  defp check_available_machines(%{"available_machines" => _}) do
    {:error, Utils.type_error_message("available_machines", "list")}
  end

end
