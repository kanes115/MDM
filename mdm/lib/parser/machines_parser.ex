defmodule MDM.JmmsrParser.MachinesParser do

  alias MDM.JmmsrParser.Utils

  @supported_os ["debian", "linux"]

  def check(%{"machines" => machines}) when is_list(machines) do
    results = for m <- machines, do: {m, check_machine(m)}
    case Utils.take_first_error(results) do
      :ok -> Utils.check_uniqueness(machines, "id", :machine_id_duplication)
      {machine, {:error, reason}} -> {:error, %{trouble_entry: machine, reason: reason}}
    end
  end
  def check(%{"machines" => _}), do: {:error, :machines_not_a_list}
  def check(_), do: {:error, :machines_undefined}

  defp check_machine(machine) do
    with :ok <- check_name(machine),
         :ok <- check_id(machine),
         :ok <- check_address(machine),
         :ok <- check_os(machine), do: :ok
  end

  defp check_name(%{"name" => s}) when is_bitstring(s), do: :ok
  defp check_name(%{"name" => _}), do: {:error, :machine_name_not_string}
  defp check_name(_), do: :ok

  defp check_id(%{"id" => i}) when is_integer(i), do: :ok
  defp check_id(%{"id" => _}), do: {:error, :machine_id_not_int}
  defp check_id(_), do: {:error, :id_undefined}

  defp check_address(%{"ip" => _, "domain" => _}), do: {:error, :ip_and_domain_sepcified}
  defp check_address(%{"ip" => ip}) do
    case correct_ip_format?(ip) do
      true -> :ok
      false -> {:error, :incorrect_ip_format}
    end
  end
  defp check_address(%{"domain" => d}) do
    case correct_domain_name_format(d) do
      true -> :ok
      false -> {:error, :incorrect_domain_format}
    end
  end
  defp check_address(_), do: {:error, :address_undefined}

  defp check_os(%{"os" => os}) when is_bitstring(os) do
    case Enum.member?(@supported_os, os) do
      true -> :ok
      false -> {:error, :os_not_supported}
    end
  end
  defp check_os(%{"os" => _}), do: {:error, :os_not_string}
  defp check_os(_), do: {:error, :os_undefined}

  defp correct_ip_format?(s), do: is_bitstring(s) # TODO

  defp correct_domain_name_format(s), do: is_bitstring(s) #TODO
  
end


