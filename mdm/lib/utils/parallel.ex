defmodule MDM.Utils do

  defmodule Parallel do
    def map(collection, func) do
      collection
      |> Enum.map(&(Task.async(fn -> func.(&1) end)))
      |> Enum.map(fn t -> Task.await(t, :infinity) end)
    end
  end

end
