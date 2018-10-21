defmodule MDMMinion.LinuxRouterBackend do
  @behaviour MDMMinion.Router
  require Logger

  def register_routes(routes) do
    res0 =
    routes
    |> Enum.map(&route_command/1)
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

  defp route_command({from, to}) do
    case is_ip(from) do
      false ->
        "echo \"#{to} #{from}\" >> /etc/host.aliases"
      true ->
        "echo \"#{from} #{to}\" >> /etc/hosts"
    end |> String.to_atom
  end

  defp save_aliases do
    # this line is not that important
    :os.cmd("echo \"export HOSTALIASES=/etc/host.aliases\" >> /etc/bash.bashrc && . /etc/bash.bashrc" |> String.to_atom) 
    case System.put_env("HOSTALIASES", "/etc/host.aliases") do
      :ok -> []
      error -> {:error, error}
    end
  end

  defp is_ip(addr) do
    case :inet.parse_address(addr |> to_charlist) do
      {:ok, _} -> true
      {:error, _} -> false
    end
  end

end
