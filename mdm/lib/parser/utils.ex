defmodule MDM.JmmsrParser.Utils do

  ## Constants
  def supported_oses(), do: ["linux", "debian"]

  def take_first_error([]), do: :ok
  def take_first_error([{_entry, :ok} | tail]), do: take_first_error(tail)
  def take_first_error([{_entry, {:error, _}} = error | _]), do: error

  # TODO probably can be more idiomatic
  def check_uniqueness(list_of_maps, field, error_reason) do
    uniq_l = list_of_maps
             |> Enum.map(fn %{^field => id} -> id end)
             |> Enum.uniq
             |> length
    case length(list_of_maps) do
      ^uniq_l -> :ok
      _ -> {:error, error_reason}
    end
  end

  def if_specified_string(map, field, error_subject) when is_map(map) do
    case Map.get(map, field, :undefined) do
      s when is_bitstring(s) -> :ok
      :undefined -> :ok
      _ -> {:error, type_error_message(error_subject, "string")}
    end
  end

  def if_specified_int(map, field, error_subject) when is_map(map) do
    case Map.get(map, field, :undefined) do
      s when is_integer(s) -> :ok
      :undefined -> :ok
      _ -> {:error, type_error_message(error_subject, "integer")}
    end
  end


  def specified_int(map, field, error_subject) when is_map(map) do
    specified(&is_integer/1, "integer", map, field, error_subject)
  end

  def specified_string(map, field, error_subject) when is_map(map) do
    specified(&is_bitstring/1, "string", map, field, error_subject)
  end


  def specified_list(map, field, error_subject) when is_map(map) do
    specified(&is_list/1, "list", map, field, error_subject)
  end

  def specified_bool(map, field, error_subject) when is_map(map) do
    specified(&is_boolean/1, "bool", map, field, error_subject)
  end

  def specified_path(map, field, error_subject) when is_map(map) do
    specified(&is_path/1, "path", map, field, error_subject)
  end


  def if_specified_warn(map, field, warning) do
    case Map.get(map, field, :undefined) do
      :undefined -> :ok
      _ ->
        IO.puts warning
    end
  end

  def type_error_message(subject, should_be) do
    "#{subject} is not a #{should_be}"
  end


  defp specified(type_checker, type, map, field, error_subject) do
    case Map.get(map, field, :undefined) do
      :undefined -> {:error, "#{inspect(error_subject)} not specified"}
      s -> case type_checker.(s) do
        true -> :ok
        false -> {:error, type_error_message(error_subject, type)}
      end
    end
  end

  defp is_path(s), do: is_bitstring(s) # TODO

end
