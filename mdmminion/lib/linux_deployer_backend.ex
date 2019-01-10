defmodule MDMMinion.LinuxDeployerBackend do
  @behaviour MDMMinion.Deployer
  @behaviour MDMMinion.Service
  require Logger

  alias MDMMinion.Utils.Parallel

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

    def get_cpu_usage(ppid) do
    case pstree_installed? do
      true ->
        ppid
        |> get_processes
        |> Parallel.map(&get_cpu_of_pid/1)
        |> Enum.filter(fn e -> e != {:error, :cant_parse} end) # it should mean the process died, we warn in logs about this situation
        |> Enum.sum
      false ->
        {:error, :pstree_not_intalled}
    end
  end

  def get_mem_usage(ppid) do
    case pstree_installed?() do
      true ->
        cmd = "smem -p -c \"pid pss\" > /tmp/mems_res"
        :os.cmd(cmd |> String.to_atom)
        get_processes(ppid)
        |> Parallel.map(&get_mem_of_pid/1)
        |> Enum.filter(fn e -> e != {:error, :cant_parse} end) # it should mean the process died, we warn in logs about this situation
        |> Enum.sum
      false ->
        {:error, :pstree_not_intalled}
    end
  end

  def get_net_usage(ppid) do
    case pstree_installed?() and nethogs_installed?() do
      true ->
        stats = get_per_pid_net_stats()
        res = get_processes(ppid)
              |> Parallel.map(fn pid -> get_net_of_pid(stats, pid) end)
              |> Enum.reduce({0, 0},
                             fn({inn, out}, {in_acc, out_acc}) -> {inn + in_acc, out + out_acc} end)
                               res
      false ->
        {:error, :nethogs_or_pstree_not_installed}
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
    try do
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
    rescue
      e -> :unknown
    end
  end

  defp nethogs_installed?, do: installed?("nethogs")

  defp pstree_installed?, do: installed?("pstree")

  defp installed?(program) do
    case System.find_executable(program) do
      nil ->
        Logger.warn "#{program} is not installed. Some metrics might not be available."
        false
      _ -> true
    end
  end

  defp get_cpu_of_pid(pid) do
    cores_no = get_cores_no()
    case get_resource_of_pid(pid, "CPU") do
      {:error, _} = e ->
        e
      cpu ->
        cpu / cores_no
    end
  end

  defp get_mem_of_pid(pid) do
    cmd = "awk '$1 == \"#{pid}\"{gsub(/%/, \"\", $2); print $2}' < /tmp/mems_res"
    execute_to_float(cmd)
  end

  defp get_processes(ppid) do
    #cmd = "ps -e -o pgid,pid | awk -v p=#{session_id} '$1 == p {print $2}'" # uncomment to get back to session id concept
    case pstree_installed? do
      true ->
        cmd = "ps -o %p -p $(pstree -p #{ppid} | grep -o '([0-9]\\+)' | grep -o '[0-9]\\+') | tail -n +2 | awk '{$1=$1};1'"
        cmd_res = :os.cmd(cmd |> String.to_atom)
                  |> to_string
        try do
          cmd_res
          |> String.split("\n")
          |> Enum.filter(fn e -> e != "" end)
          |> Enum.map(&Integer.parse/1)
          |> Enum.map(fn e -> e |> elem(0) end)
        rescue
          e ->
            # TODO there is a hazard here probably. If service dies and we already
            # asked about metrics we will get no processes which will make the
            # above code to break. This rescue should help. We print error to see
            # if this is true.
            Logger.warn " [KUBA, if you see this log, send it to me] There was an error when trying to collect processes.
             Can't parse pstree result (command was: #{cmd}) :\n#{cmd_res}"
             []
        end
      false ->
        {:error, :pstree_not_installed}
    end
  end

  defp get_resource_of_pid(pid, resource) do
    cmd = "top -bn1 -p #{pid |> to_string} | awk '$1 == \"PID\"{pids=1;for(i=1;i<=NF;i++){col[$i]=i;}next;}pids{res++;print $col[\"%#{resource}\"];}END{if(!res)print \"0.0\"}'"
    execute_to_float(cmd)
  end

  defp execute_to_float(cmd, warn? \\ true) do
    res0 = :os.cmd(cmd |> String.to_atom)
    |> to_string

    res = res0 |> Float.parse
    case res do
      {val, "\n"} ->
        val
      _ ->
        warn? and
        Logger.warn(
          "Couldn't parse #{inspect(res0)}. It probably means pid died meanwhile"
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
