defmodule MDM.JmmsrParser do

  alias MDM.JmmsrParser.ConfigParser
  alias MDM.JmmsrParser.MachinesParser
  alias MDM.JmmsrParser.ServicesParser
  alias MDM.JmmsrParser.ConnectionsParser
  alias MDM.JmmsrParser.Utils
    
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
         :ok <- ServicesParser.check(json)
         #:ok <- ConnectionsParser.check(json)
    do
      :ok
    else
      error ->
        transform_error(error)
    end
  end

  defp check_relations(_json) do
    :ok # TODO
  end

  defp transform_error({false, path, reason}) do
    {:error, human_readable_path(path), human_readable_reason(reason)}
  end

  defp human_readable_path(list) do
    list
    |> Enum.reduce("", fn e, "" -> e
                          e, acc -> acc <> ", " <> e end)
  end

  defp human_readable_reason(:not_found), do: :not_found
  defp human_readable_reason(:predicate), do: :type_mismatch
  defp human_readable_reason(reason), do: reason

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
