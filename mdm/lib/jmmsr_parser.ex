defmodule MDM.JmmsrParser do

  def from_file(path) do
    IO.inspect(File.read(path))
    with {:ok, body} <- File.read(path),
         {:ok, json} <- Poison.decode(body), do: {:ok, json}
  end

end
