defmodule MDM.JmmsrParser.Utils do

  ## Constants
  def supported_oses(), do: ["linux", "debian"]

  def known_os?(os), do: Enum.member?(supported_oses(), os)

  def check_uniqueness(list_of_maps, fields, error_reason) when is_list(fields) do
    minimal_maps = 
      Enum.map(list_of_maps, fn map ->
        to_remove = Map.keys(map) -- fields
        throw_keys_out(map, to_remove)
      end)
    do_check_uniqeness(minimal_maps, error_reason)
  end
  def check_uniqueness(list_of_maps, field, error_reason) do
    check_uniqueness(list_of_maps, [field], error_reason)
  end

  defp do_check_uniqeness(list, error_reason) do
    uniq_l = list
    |> Enum.uniq
    |> length
    case length(list) do
      ^uniq_l -> :ok
      _ -> {:error, error_reason}
    end
  end

  defp throw_keys_out(map, keys) do
    Enum.reduce(keys, map, fn f, acc ->
      {_, new_acc} = Map.pop(acc, f)
      new_acc
    end)
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

  def is_path(s), do: is_bitstring(s) # TODO

  # =======================================================
  
  def path(json, fields) do
    case do_path(json, fields) do
      v when is_list(v) -> 
        {:list, flatten(v)}
      {:value, v} -> {:value, v}
      :not_found -> :not_found
    end
  end
    

  defp do_path(json, [field]) do
    case Map.get(json, field, :not_found) do
      :not_found -> :not_found
      v -> {:value, v}
    end
  end
  defp do_path(json, [field | fields]) do
    case Map.get(json, field, :undefined) do
      :undefined -> 
        :not_found
      values when is_list(values) ->
        values 
        |> Enum.map(fn v -> do_path(v, fields) end)
      value ->
        do_path(value, fields)

    end
  end

  defp print(val, text), do: IO.inspect "#{text} #{inspect(val)}"

  # can't check list values with this!
  def check_values(json, path, checker) do
    check_values(json, path, checker, true)
  end

  def check_values(json, path, {checker_fun, return_reason}, must_be_defined?) do
    case check_values(json, path, checker_fun, must_be_defined?) do
      true -> true
      {false, path, :predicate} -> {false, path, return_reason}
      e -> e
    end
  end
  def check_values(json, path, checker_fun, must_be_defined?) do
    json
    |> path(path)
    |> check_not_found(must_be_defined?)
    |> maybe_check_predicate(checker_fun)
    |> maybe_return_error(path)
  end


  defp check_not_found({:list, values}, true) do
    case Enum.any?(values, fn e -> e == :not_found end) do
      true -> :not_found
      false -> {:list, values}
    end
  end
  defp check_not_found(:not_found, true), do: :not_found
  defp check_not_found(:not_found, false), do: :single_not_found_ignored
  defp check_not_found({:value, single_val}, true), do: {:value, single_val}
  defp check_not_found({:list, values}, false), do: {:list, remove_not_founds(values)}
  defp check_not_found(val, false), do: val

  defp remove_not_founds(values) when is_list(values) do
    values |> Enum.filter(fn e -> e != :not_found end)
  end
  defp remove_not_founds(value), do: remove_not_founds([value])

  defp maybe_check_predicate(:not_found, _), do: :not_found
  defp maybe_check_predicate(:single_not_found_ignored, _), do: true
  defp maybe_check_predicate({:list, values}, pred) do
    pure_vals = values |> Enum.map(fn {:value, val} -> val end)
    case Enum.all?(pure_vals, pred) do
      true -> {:list, values}
      false -> :predicate
    end
  end
  defp maybe_check_predicate({:value, single_value}, pred) do
    case pred.(single_value) do
      true -> {:value, single_value}
      false -> :predicate
    end
  end

  defp wrap_in_list(val) when is_list(val), do: val
  defp wrap_in_list(val), do: [val]

  defp maybe_return_error(reason, path) when reason == :not_found or
  reason == :predicate do
    {false, path, reason}
  end
  defp maybe_return_error(_, _), do: true


  def flatten(list, depth \\ -2), do: flatten(list, depth + 1, []) |> Enum.reverse
  def flatten(list, 0, acc), do: [list | acc]
  def flatten([h | t], depth, acc) when h == [], do: flatten(t, depth, acc)
  def flatten([h | t], depth, acc) when is_list(h), do: flatten(t, depth, flatten(h, depth - 1, acc))
  def flatten([h | t], depth, acc), do: flatten(t, depth, [h | acc])
  def flatten([], _, acc), do: acc



  def list_of?(v, pred) when is_list(v) do
    Enum.all?(v, fn e -> pred.(e) end)
  end
  def list_of?(_, _), do: false

  def list_of_strings?(list), do: list_of?(list, &is_bitstring/1)

  def list_of_ints?(list), do: list_of?(list, &is_integer/1)

  def take_first_error([]), do: true
  def take_first_error([true | tail]), do: take_first_error(tail)
  def take_first_error([{false, path, reason} | tail]), do: {false, path, reason}


end
