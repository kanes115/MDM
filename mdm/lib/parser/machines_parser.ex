defmodule MDM.JmmsrParser.MachinesParser do

  alias MDM.JmmsrParser.Utils

  def check(%{"machines" => machines}) when is_list(machines) do
    results = for m <- machines, do: {m, check_machine(m)}
    case Utils.take_first_error(results) do
      :ok -> Utils.check_uniqueness(machines, "id", :machine_id_duplication)
      {machine, {:error, reason}} -> {:error, %{trouble_entry: machine, reason: reason}}
    end
  end
  def check(%{"machines" => _}), do: {:error, Utils.type_error_message("machines", "list")}
  def check(_), do: {:error, "machines undefined"}

  defp check_machine(machine) when is_map(machine) do
    with :ok <- check_name(machine),
         :ok <- check_id(machine),
         :ok <- check_address(machine),
         :ok <- check_os(machine), do: :ok
  end
  defp check_machine(_), do: {:error, "machine is not a map"}

  defp check_name(machine), do: Utils.if_specified_string(machine, "name", "machine's name")

  defp check_id(map), do: Utils.specified_int(map, "id", "machine's id")

  defp check_address(%{"ip" => _, "domain" => _}), do: {:error, "ip and domain sepcified"}
  defp check_address(%{"ip" => ip}) do
    case correct_ip_format?(ip) do
      true -> :ok
      false -> {:error, "incorrect ip format"}
    end
  end
  defp check_address(%{"domain" => d}) do
    case correct_domain_name_format(d) do
      true -> :ok
      false -> {:error, "incorrect domain format"}
    end
  end
  defp check_address(_), do: {:error, "address undefined"}

  defp check_os(%{"os" => os}) when is_bitstring(os) do
    case Enum.member?(Utils.supported_oses(), os) do
      true -> :ok
      false -> {:error, "#{inspect(os)} not supported"}
    end
  end
  defp check_os(%{"os" => _}), do: {:error, Utils.type_error_message("os", "string")}
  defp check_os(_), do: {:error, "os undefined"}

  defp correct_ip_format?(s), do: is_bitstring(s) # TODO

  defp correct_domain_name_format(s), do: is_bitstring(s) #TODO
  
end


