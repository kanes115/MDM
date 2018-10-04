defmodule MDMMinion.LinuxRouterBackend do
  @behaviour MDMMinion.Router
  require Logger

  def register_routes(routes) do
    res0 =
    routes
    |> Enum.map(fn {f, t} -> "echo \"#{f} #{t}\" >> /etc/host.aliases" |> String.to_atom end)
    |> Enum.map(fn cmd -> 
      Logger.info("Executing #{cmd}")
      :os.cmd(cmd) end)

    res = [save_aliases() | res0]
    ok? = res |> Enum.all?(fn r -> r == [] end)
    case ok? do
      true -> :ok
      _ ->
        {:error, res |> Enum.find(fn r -> r != [] end)}
    end
  end

  defp save_aliases do
    # this line is not that important
    :os.cmd("echo \"export HOSTALIASES=/etc/host.aliases\" >> /etc/profile && . /etc/profile" |> String.to_atom) 
    case System.put_env("HOSTALIASES", "/etc/host.aliases") do
      :ok -> []
      error -> {:error, error}
    end
  end


end
