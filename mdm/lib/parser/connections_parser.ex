defmodule MDM.JmmsrParser.ConnectionsParser do

  alias MDM.JmmsrParser.Utils

  def check(%{"connections" => conns}) when is_list(conns) do
    results = for m <- conns, do: {m, check_connection(m)}
    case Utils.take_first_error(results) do
      :ok -> Utils.check_uniqueness(conns, ["service_from", "service_to"], 
                                    "connection duplication")
      {conn, {:error, reason}} -> {:error, %{trouble_entry: conn, reason: reason}}
    end
  end
  def check(%{"connections" => _}), do: {:error, Utils.type_error_message("connections", "list")}
  def check(_), do: {:error, "connections undefined"}


  defp check_connection(c) do
    with :ok <- Utils.specified_string(c, "service_from", "service_from"),
         :ok <- Utils.specified_string(c, "service_to", "service_to"),
         :ok <- Utils.specified_int(c, "port", "port"), do: :ok
  end

end
