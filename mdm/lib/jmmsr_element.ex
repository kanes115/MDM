defmodule MDM.JmmsrElement do

  @callback from_map(map()) :: struct()
  @callback to_map(struct()) :: map()

  @callback key :: atom()
  @callback list? :: boolean()

  def convert(module, jmmsr) do
    key = module.key()
    case module.list? do
      false ->
        jmmsr
        |> Map.update!(key, &module.from_map/1)
      true ->
        jmmsr
        |> Map.update!(key, fn list ->
          Enum.map(list, &module.from_map/1) end)
    end
  end

end
