defmodule MDMMinion.LinuxNetworkInfoBackend do
  @behaviour MDMMinion.NetworkInfo

  @doc """
  ifstat -T | head -n 3 | tail -n 1 | awk '{$1=$1};1' | rev | cut -d' ' -f1 | rev
  (1)         (2)         (3)           (4)             (5)       (6)         (7)

  1 - Program that prints traffic in form:
  ```
           eth0               Total
   KB/s in  KB/s out   KB/s in  KB/s out
      0.00      0.00      0.00      0.00
      0.00      0.00      0.00      0.00
  ```
  2+3 - We take only first line that contains numbers
  4 - We remove trailing and leading spaces and converitng multiple spaces into one
  5+7 - We reverse to be able to cut from the and as Total is the last column
  6 - we cut only the number we are interested in
  """
  @get_net_out_cmd "ifstat -w -T 1 1 | head -n 3 | tail -n 1 | awk '{$1=$1};1' | rev | cut -d' ' -f1 | rev" |> String.to_atom
  @get_net_in_cmd "ifstat -w -T 1 1 | head -n 3 | tail -n 1 | awk '{$1=$1};1' | rev | cut -d' ' -f2 | rev" |> String.to_atom

  def get_traffic_for_machine do
    with true <- ifstat_installed?(),
         {:ok, traffic} <- fetch_traffic()
    do
      {:ok, traffic}
    else
      false -> {:error, :ifstat_not_installed}
      error -> error
    end
  end

  defp fetch_traffic do
    with {net_out, ""} <- get_net(:out),
         {net_in, ""} <- get_net(:in)
    do
      {:ok, {net_in, net_out}}
    else
      {_, reason} -> {:error, reason}
    end
  end

  defp ifstat_installed? do
    case System.find_executable("ifstat") do
      nil -> false
      _ -> true
    end
  end

  defp get_net(:out),
  do: :os.cmd(@get_net_out_cmd) |> to_string |> String.trim("\n") |> Float.parse
  defp get_net(:in),
  do: :os.cmd(@get_net_in_cmd) |> to_string |> String.trim("\n") |> Float.parse


end
