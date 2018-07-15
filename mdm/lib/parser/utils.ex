defmodule MDM.JmmsrParser.Utils do

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

end
