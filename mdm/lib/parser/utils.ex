defmodule MDM.JmmsrParser.Utils do

  ## Constants
  def supported_oses(), do: ["linux", "debian"]

  def known_os?(os), do: Enum.member?(supported_oses(), os)

  def check_uniqueness(list_of_maps, fields) when is_list(fields) do
    minimal_maps = 
      Enum.map(list_of_maps, fn map ->
        to_remove = Map.keys(map) -- fields
        throw_keys_out(map, to_remove)
      end)
    do_check_uniqeness(minimal_maps)
  end
  def check_uniqueness(list_of_maps, field) do
    check_uniqueness(list_of_maps, [field])
  end

  defp do_check_uniqeness(list) do
    uniq_l = list
    |> Enum.uniq
    |> length
    case length(list) do
      ^uniq_l -> :ok
      _ -> :error
    end
  end

  defp throw_keys_out(map, keys) do
    Enum.reduce(keys, map, fn f, acc ->
      {_, new_acc} = Map.pop(acc, f)
      new_acc
    end)
  end

  @doc """
  Checks if given argument is a unix-like path
  """
  def is_path(s), do: is_bitstring(s) # TODO

  @doc """
  This function returns values in json specified by
  path given as 2nd argument. 
  If the path has lists on its way, it returns a list of all
  leaf values and puts it inside a tuple `{:list, ListOfActualValues}`
  to indicate there are multiple values. Each value (or one value if
  there was no split on list) is put in a tuple `{:value, Value}`.

  ## Examples
  Example can be seen in test/parser_utils_test.exs
  """
  def path(json, fields) do
    case do_path(json, fields) do
      v when is_list(v) -> 
        {:list, flatten(v)}
      {:value, v} -> {:value, v}
      :not_found -> :not_found
    end
  end

  @doc """
  Strips the returned by `path/2` function value leaving only
  the second element of a tuple.

  ## Examples
  iex(1)> unpack({:list, [value: "ala", value: "ma"]})
  [value: "ala", value: "ma"]
  iex(1)> unpack({:value, "ala"})
  "ala"
  """
  def unpack({:value, v}), do: v
  def unpack({:list, v}), do: v
  def unpack(list) when is_list(list) do
    list
    |> Enum.map(fn {:value, v} -> v end)
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

  @doc """
  Checks whether elements under `path` in `json` fulfill
  given predicate `checker`. If option `must_be_defined?` set to false
  given path might not exist at all (for some splits on lists) (but if 
  it exists it must fiulfill the predicate).
  """
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

  defp maybe_return_error(reason, path) when reason == :not_found or
  reason == :predicate do
    {false, path, reason}
  end
  defp maybe_return_error(_, _), do: true


  defp flatten(list, depth \\ -2), do: flatten(list, depth + 1, []) |> Enum.reverse
  defp flatten(list, 0, acc), do: [list | acc]
  defp flatten([h | t], depth, acc) when h == [], do: flatten(t, depth, acc)
  defp flatten([h | t], depth, acc) when is_list(h), do: flatten(t, depth, flatten(h, depth - 1, acc))
  defp flatten([h | t], depth, acc), do: flatten(t, depth, [h | acc])
  defp flatten([], _, acc), do: acc


  def list_of?(v, pred) when is_list(v) do
    Enum.all?(v, fn e -> pred.(e) end)
  end
  def list_of?(_, _), do: false

  def list_of_strings?(list), do: list_of?(list, &is_bitstring/1)

  def list_of_ints?(list), do: list_of?(list, &is_integer/1)

  def take_first_error([]), do: true
  def take_first_error([true | tail]), do: take_first_error(tail)
  def take_first_error([{false, path, reason} | _]), do: {false, path, reason}


end
