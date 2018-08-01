defmodule MDM.JmmsrParser.ConnectionsParser do

  alias MDM.JmmsrParser.Utils

  def check(json) do
    with true <- Utils.check_values(json, ["connections"],
                                    &is_list/1),
         true <- Utils.check_values(json, ["connections", "service_from"],
                                    &is_bitstring/1),
         true <- Utils.check_values(json, ["connections", "service_to"],
                                    &is_bitstring/1),
         true <- Utils.check_values(json, ["connections", "port"],
                                    {&correct_port?/1, :invalid_port}), do: :ok
  end

  defp correct_port?(port) when port > 0 and port < 65000, do: true
  defp correct_port?(_), do: false

end
