defmodule MDM.JmmsrParser.MachinesParser do

  alias MDM.JmmsrParser.Utils

  @behaviour MDM.JmmsrParser

  def check_typing(json) do
    with true <- Utils.check_values(json, ["machines"],
                                    &is_list/1),
         true <- Utils.check_values(json, ["machines", "name"],
                                    &is_bitstring/1),
         true <- Utils.check_values(json, ["machines", "id"],
                                    &is_integer/1),
         true <- Utils.check_values(json, ["machines", "ssh_host"],
                                    &is_bitstring/1),
         true <- check_address(json),
         true <- Utils.check_values(json, ["machines", "os"],
                                    {&Utils.known_os?/1, :unknown_os}), do: :ok
  end

  def check_relations(json) do
    res = Utils.path(json, ["machines"])
          |> Utils.unpack
          |> Utils.check_uniqueness(["id"])
    case res do
      :ok -> :ok
      :error -> {false, ["machines"], :not_unique}
    end
  end

  defp check_address(json) do
    {:list, ips} = Utils.path(json, ["machines", "ip"])
    {:list, domains} = Utils.path(json, ["machines", "domain"])
    ip_domain = Enum.zip(ips, domains)
    case check_addresses(ip_domain) do
      :ok ->
        check_types(ip_domain)
      {:error, reason} ->
        {false, ["machines"], reason}
    end
  end

  defp check_types(ip_domains) do
    ip_domains
    |> Enum.map(fn {ip, domain} -> {un_value(ip), un_value(domain)} end)
    |> Enum.map(&correct_address_pair?/1)
    |> Utils.take_first_error
  end

  defp un_value(:not_found), do: :not_found
  defp un_value({:value, v}), do: v

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

end


