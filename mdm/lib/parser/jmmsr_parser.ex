defmodule MDM.JmmsrParser do

  alias MDM.JmmsrParser.ConfigParser
  alias MDM.JmmsrParser.MachinesParser
    
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
    with :ok <- ConfigParser.check(json),
         :ok <- MachinesParser.check(json)
    do
      :ok
    else
      error ->
        print_error(error)
        :error
    end
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
