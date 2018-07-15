defmodule MDM.JmmsrParser do

  alias MDM.JmmsrParser.ConfigParser
  alias MDM.JmmsrParser.MachinesParser
  alias MDM.JmmsrParser.ServicesParser
  alias MDM.JmmsrParser.ConnectionsParser
    
  # TODO recursively
  defp keys_to_atoms(json) do
    for {key, val} <- json, into: %{}, do: {String.to_atom(key), val}
  end

  def from_file(path) do
    with {:ok, body} <- File.read(path),
         {:ok, json} <- Poison.decode(body),
         :ok <- check_correctness(json), do: {:ok, json}
  end

  defp check_correctness(json) do
    with :ok <- check_presence_and_types(json),
         :ok <- check_relations(json), do: :ok
    
  end

  defp check_presence_and_types(json) do
    with :ok <- ConfigParser.check(json),
         :ok <- MachinesParser.check(json),
         :ok <- ServicesParser.check(json),
         :ok <- ConnectionsParser.check(json)
    do
      :ok
    else
      error ->
        print_error(error)
        :error
    end
  end

  defp check_relations(_json) do
    :ok # TODO
  end

  # TODO use Lagger
  defp print_error({:error, %{reason: reason, trouble_entry: entry}}) do
    IO.puts "Error parsing for reason #{inspect(reason)}. Entry: #{inspect(entry)}"
  end
  defp print_error({:error, %{reason: reason}}) do
    IO.puts "Error parsing for reason #{inspect(reason)}."
  end
  defp print_error({:error, reason}) do
    print_error({:error, %{reason: reason}})
  end


end
