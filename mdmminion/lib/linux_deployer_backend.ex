defmodule MDMMinion.LinuxDeployerBackend do
  @behaviour MDMMinion.Deployer
  @behaviour MDMMinion.Service
  require Logger

  ## Deployer callbacks
  
  def start, do: ensure_tmp_dir_exists_and_empty()

  def save_file(file, prefix) do
    case File.copy(file, tmp_file_path(prefix)) do
      {:ok, _byte_copied} -> {:ok, tmp_file_path(prefix)}
      err -> err
    end
  end

  def prepare_service_files(file, service_name) do
    service_dir_name = generate_service_dir_name(service_name)
    service_dir = services_dir() |> Path.join(service_dir_name)
    File.mkdir(service_dir)
    {:ok, _} = :zip.extract(file |> to_charlist,
                            cwd: service_dir |> to_charlist)
    service_dir
  end
  
  def get_cpu_usage(session_id) do
    res = get_processes(session_id)
    |> Enum.map(&get_cpu_of_pid/1)
    |> Enum.filter(fn e -> e != {:error, :cant_parse} end) # it should mean the process died, we warn in logs about this situation
    |> Enum.sum
    res
  end

  def get_mem_usage(session_id) do
    res = get_processes(session_id)
    |> Enum.map(&get_mem_of_pid/1)
    |> Enum.filter(fn e -> e != {:error, :cant_parse} end) # it should mean the process died, we warn in logs about this situation
    |> Enum.sum
    res
  end

  def get_net_usage(session_id) do
    case nethogs_installed?() do
      true ->
        stats = get_per_pid_net_stats()
        res = get_processes(session_id)
              |> Enum.map(fn pid -> get_net_of_pid(stats, pid) end)
              |> Enum.reduce({0, 0},
                             fn({inn, out}, {in_acc, out_acc}) -> {inn + in_acc, out + out_acc} end)
                               res
      false ->
        {:error, :nethogs_not_installed}
    end
  end

  
  ## Private

  defp get_net_of_pid(stats, pid) do
    case List.keyfind(stats, pid, 0) do
      nil -> {0.0, 0.0} # If it's not here it means it does not use network
      {^pid, net_in, net_out} -> {net_in, net_out}
    end
  end

  defp get_per_pid_net_stats do
    # TODO this is a little bit volatile so we probably need to fix
    # the version of nethogs (in case it's api changes or sth)
    cmd = "nethogs -bc 2 2> /dev/null | awk '{$1=$1};1'"
    :os.cmd(cmd |> String.to_atom)
    |> to_string
    |> String.split("\nRefreshing:\n")
    |> Enum.at(2)
    |> String.split("\n")
    |> Enum.filter(fn e -> e != "" end) # Splitting on newline leaves one empty string
    |> Enum.map(&parse_nethogs_line/1)
    |> Enum.filter(fn e -> e != :unknown end)
  end

  @spec parse_nethogs_line(String.t) :: {pid :: integer(), net_in :: float(), net_out :: float()} | :unknown
  defp parse_nethogs_line("unknown" <> _), do: :unknown # there is a collective net stat for unknonwn pids, we omit it
  defp parse_nethogs_line(line) do
    [process, out, inn] = line
                          |> String.split(" ")
    pid = process
          |> String.split("/")
          |> Enum.reverse
          |> Enum.at(1)
          |> Integer.parse
          |> elem(0)
    {out_f, _} = Float.parse(out)
    {in_f, _} = Float.parse(inn)
    {pid, in_f, out_f}
  end

  defp nethogs_installed? do
    case System.find_executable("nethogs") do
      nil ->
        Logger.warn "nethogs is not installed. Network statistics for services won't be available"
        false
      _ -> true
    end
  end

  defp get_cpu_of_pid(pid) do
    cores_no = get_cores_no()
    case get_resource_of_pid(pid, "cpu") do
      {:error, _} = e ->
        e
      cpu ->
        cpu / cores_no
    end
  end

  defp get_mem_of_pid(pid) do
    get_resource_of_pid(pid, "mem")
  end
  
  defp get_processes(session_id) do
    cmd = "ps -e -o pgid,pid | awk -v p=#{session_id} '$1 == p {print $2}'"
    :os.cmd(cmd |> String.to_atom)
    |> to_string
    |> String.split("\n")
    |> Enum.filter(fn e -> e != "" end)
    |> Enum.map(&Integer.parse/1)
    |> Enum.map(fn e -> e |> elem(0) end)
  end

  defp get_resource_of_pid(pid, resource) do
    cmd = "ps -p #{pid |> to_string} -o %#{resource} | tail -n 1 | awk '{$1=$1};1'"
    execute_to_float(cmd)
  end

  defp execute_to_float(cmd, warn? \\ true) do
    res = :os.cmd(cmd |> String.to_atom)
    |> to_string
    |> Float.parse
    case res do
      {val, "\n"} ->
        val
      _ ->
        warn? and
        Logger.warn(
          "Couldn't parse #{inspect(res)}. It probably means pid died meanwhile"
        )
        {:error, :cant_parse}
    end

  end

  defp generate_service_dir_name(s), do: s

  defp get_cores_no do
    cmd = "grep -c ^processor /proc/cpuinfo"
    :os.cmd(cmd |> String.to_atom)
    |> to_string
    |> Integer.parse
    |> elem(0)
  end

  defp tmp_dir, do: "~/tmp_mdm/" |> Path.expand
  defp tmp_file_path(prefix), do: "#{tmp_dir()}/#{prefix}_service.tar"
  defp services_dir, do: "~/mdm_services/" |> Path.expand


  defp ensure_tmp_dir_exists_and_empty do
    File.rm_rf(tmp_dir())
    File.mkdir!(tmp_dir())
  end


end
