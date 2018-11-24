defmodule MDM.JmmsrElement do

  @callback from_map(map()) :: struct()
  @callback to_map(struct()) :: map()

  @callback key :: atom()
  @callback list? :: boolean()

  @doc "Converts jmmsr from json to Element"
  def convert(module, jmmsr), do: convert_with(module, jmmsr, &module.from_map/1)

  @doc "Converts Element to json"
  def unconvert(module, jmmsr), do: convert_with(module, jmmsr, &module.to_map/1)

  defp convert_with(module, jmmsr, convert_func) do
    key = module.key()
    case module.list? do
      false ->
        jmmsr
        |> Map.update!(key, convert_func)
      true ->
        jmmsr
        |> Map.update!(key, fn list ->
          Enum.map(list, convert_func) end)
    end

  end

end
