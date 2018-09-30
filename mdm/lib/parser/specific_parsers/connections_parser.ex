defmodule MDM.JmmsrParser.ConnectionsParser do

  alias MDM.JmmsrParser.Utils

  @behaviour MDM.JmmsrParser

  def check_typing(json) do
    with true <- Utils.check_values(json, ["connections"],
                                    &is_list/1),
         true <- Utils.check_values(json, ["connections", "service_from"],
                                    &is_bitstring/1),
         true <- Utils.check_values(json, ["connections", "service_to"],
                                    &is_bitstring/1),
         true <- Utils.check_values(json, ["connections", "port"],
                                    {&correct_port?/1, :invalid_port}), do: :ok
  end

  def check_relations(json) do
    with true <- check_uniqueness(json),
         true <- check_relations_with_services(json), do: :ok
  end

  defp check_uniqueness(json) do
    json
    |> Utils.path(["connections"])
    |> Utils.unpack
    |> Utils.check_uniqueness(["service_from", "service_to"])
    |> to_error
  end

  defp check_relations_with_services(json) do
    defined_services = json
                       |> Utils.path(["services", "name"])
                       |> Utils.unpack
                       |> Utils.unpack
    services_from = json
                    |> Utils.path(["connections", "service_from"])
                    |> Utils.unpack
                    |> Utils.unpack
    services_to = json
                  |> Utils.path(["connections", "service_to"])
                  |> Utils.unpack
                  |> Utils.unpack
    services = services_from ++ services_to
    services 
    |> Enum.map(fn s -> 
      to_uniqueness_error(Enum.member?(defined_services, s)) 
    end)
    |> Utils.take_first_error
  end

  # TODO change name of this function
  defp to_uniqueness_error(true), do: true
  defp to_uniqueness_error(false), do: {false, ["connections"], :undefined_service}

  defp to_error(:ok), do: true
  defp to_error(:error), do: {false, ["connections"], :not_unique}

  defp correct_port?(port) when port > 0 and port < 65000, do: true
  defp correct_port?(_), do: false

end
