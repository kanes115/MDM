defmodule MDMMinion.Utils do

  defmodule Parallel do
    def map(collection, func) do
      collection
      |> Enum.map(&(Task.async(fn -> func.(&1) end)))
      |> Enum.map(fn t -> Task.await(t) end)
    end
  end

end
