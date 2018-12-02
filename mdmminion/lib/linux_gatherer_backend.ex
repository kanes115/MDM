defmodule MDMMinion.LinuxGathererBackend do
  @behaviour MDMMinion.InfoGatherer

  def machine_cpu_max do
    cmd = :"(lscpu | grep -i 'CPU Max' || lscpu | grep -i 'CPU MHz') | awk '{print $NF}'"
    res = :os.cmd(cmd)
    {res_int, ""} = res
                    |> to_string
                    |> strip_newline
                    |> Float.parse
    {res_int, :mhz}
  end

  def machine_mem_max do
    cmd = :"awk -v \"awkmult=1\" '/MemTotal/{print $2*awkmult}' /proc/meminfo"
    res = :os.cmd(cmd)
    {res_int, ""} = res
                    |> to_string
                    |> strip_newline
                    |> Float.parse
    {res_int, :kb}
  end

  def machine_hdd do
    cmd = :"df -k | awk '$NF == \"/\"{print $4}'"
    res = :os.cmd(cmd)
    {res_int, ""} = res
                    |> to_string
                    |> strip_newline
                    |> Float.parse
    {res_int, :kb}
  end

  def cpu_cores do
    cmd = :"cat /proc/cpuinfo | awk '/^processor/{print $3}' | wc -l"
    res = :os.cmd(cmd)
    {res_int, ""} = res
                    |> to_string
                    |> strip_newline
                    |> Float.parse
    {res_int, :cores}

  end


  defp strip_newline(str), do: String.trim(str, "\n")

end
