defmodule MDM.JmmsrParser do

  alias MDM.JmmsrParser.ConfigParser
  alias MDM.JmmsrParser.MachinesParser
  alias MDM.JmmsrParser.ServicesParser
  alias MDM.JmmsrParser.ConnectionsParser
  alias MDM.JmmsrParser.LiveMetricsParser

                  

  @type path :: [String.t]
  @type error_desc :: atom

  @callback check_typing(Map.t) :: :ok | {false, path, error_desc}
  @callback check_relations(Map.t) :: :ok | {false, path, error_desc}

  
  def from_file(path) do
    with {:ok, body} <- File.read(path),
         {:ok, json} <- Poison.decode(body),
         :ok <- check_correctness(json), do: {:ok, json}
  end

  def to_internal_repr(json, jmmsr_elements) do
    case check_correctness(json) do
      :ok ->
        jmmsr0 = json
                 |> keys_to_atoms
        res = jmmsr_elements
              |> Enum.reduce(jmmsr0, fn converter, jmmsr ->
                         MDM.JmmsrElement.convert(converter, jmmsr) end)
        {:ok, res}
      error -> error
    end
  end

  defp check_correctness(json) do
    with :ok <- check_presence_and_types(json),
         :ok <- check_relations(json), do: :ok
  end

  defp check_presence_and_types(json) do
    with :ok <- ConfigParser.check_typing(json),
         :ok <- MachinesParser.check_typing(json),
         :ok <- ServicesParser.check_typing(json),
         :ok <- ConnectionsParser.check_typing(json),
         :ok <- LiveMetricsParser.check_typing(json)
    do
      :ok
    else
      error ->
        transform_error(error)
    end
  end

  defp check_relations(json) do
    with :ok <- ServicesParser.check_relations(json),
         :ok <- MachinesParser.check_relations(json),
         :ok <- ConnectionsParser.check_relations(json),
         :ok <- LiveMetricsParser.check_relations(json)
    do
      :ok
    else
      error ->
        transform_error(error)
    end
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


  defp keys_to_atoms(string_key_map) when is_map(string_key_map) do
    for {key, val} <- string_key_map, into: %{}, do: {String.to_atom(key), keys_to_atoms(val)}
    end
  defp keys_to_atoms(string_key_map) when is_list(string_key_map) do
    string_key_map
    |> Enum.map(&keys_to_atoms/1)
  end
  defp keys_to_atoms(value), do: value

end
