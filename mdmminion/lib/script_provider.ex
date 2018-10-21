defmodule MDMMinion.ScriptProvider do

  def get(:service_runner, :unix),
    do: "./scripts/linux/service_runner.sh" |> Path.expand

end
