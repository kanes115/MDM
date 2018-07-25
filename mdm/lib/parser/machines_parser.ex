defmodule MDM.JmmsrParser.MachinesParser do

  alias MDM.JmmsrParser.Utils

  def check(json) do
    with true <- Utils.check_values(json, ["machines"],
                                    &is_list/1),
         true <- Utils.check_values(json, ["machines", "name"],
                                    &is_bitstring/1),
         true <- Utils.check_values(json, ["machines", "id"],
                                    &is_integer/1),
         true <- check_address(json),
         true <- Utils.check_values(json, ["machines", "os"],
                                     &known_os?/1), do: :ok
  end

  defp check_address(json) do
    ips = Utils.path(json, ["machines", "ip"])
    domains = Utils.path(json, ["machines", "domain"])
    ip_domain = Enum.zip(ips, domains)
    case check_addresses(ip_domain) do
      :ok ->
        check_types(ip_domain)
      {:error, reason} ->
        {false, "machines", reason}
    end
  end

  defp check_types(ip_domains) do
    Enum.map(&correct_address_pair?/1, ip_domains)
    |> take_first_error
  end

  defp correct_address_pair?({ip, domain}) do
    case is_bitstring(ip) or ip == :not_found do
      false -> {false, ["machines", "ip"], :type_mismatch}
      true -> 
        case is_bitstring(domain) or domain == :not_found do
          false -> {false, ["machines", "domain"], :type_mismatch}
          true -> true
        end
    end
  end

  defp check_addresses({:error, error}), do: {:error, error}
  defp check_addresses([{:not_found, :not_found} | _]), do: {:error, :no_address}
  defp check_addresses([{_ip, :not_found} | tail]), do: check_addresses(tail)
  defp check_addresses([{:not_found, _domain} | tail]), do: check_addresses(tail)
  defp check_addresses([{_ip, _domain} | _]), do: {:error, :two_addresses}
  defp check_addresses([]), do: :ok

  defp known_os?(os), do: Enum.member?(Utils.supported_oses(), os)

  defp correct_ip_format?(s), do: is_bitstring(s) # TODO

  defp correct_domain_name_format(s), do: is_bitstring(s) #TODO

  defp take_first_error([]), do: true
  defp take_first_error([true | tail]), do: take_first_error(tail)
  defp take_first_error([{false, path, reason} | tail]), do: {false, path, reason}
  
end


