defmodule MDMMinion.LinuxGathererBackend do
  @behaviour MDMMinion.InfoGatherer

  def machine_cpu_max do
    cmd = :"(lscpu | grep -i 'CPU Max' || lscpu | grep -i 'CPU MHz') | awk '{print $NF}'"
    res = :os.cmd(cmd)
    {res_int, ""} = res
                    |> to_string
                    |> strip_newline
                    |> Float.parse
    res_int
  end


  defp strip_newline(str), do: String.trim(str, "\n")

end
