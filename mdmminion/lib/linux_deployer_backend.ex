defmodule MDMMinion.LinuxDeployerBackend do
  @behaviour MDMMinion.Deployer
  @behaviour MDMMinion.Service
  require Logger

  ## Deployer callbacks
  
  def start, do: create_tmp_dir()

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
    :ok = :erl_tar.extract(file, cwd: service_dir)
    service_dir
  end

  def get_cpu_usage(session_id) do
    Logger.info "collecting cpu usage..."
    res = get_processes(session_id)
    |> Enum.map(&get_cpu_of_pid/1)
    |> Enum.filter(fn e -> e != {:error, :cant_parse} end) # it should mean the process died, we warn in logs about this situation
    |> Enum.sum
    Logger.info "Cpu usage for session #{session_id |> to_string} is #{res |> to_string} %"
    res
  end

  def get_mem_usage(session_id) do
    Logger.info "collecting mem usage..."
    res = get_processes(session_id)
    |> Enum.map(&get_mem_of_pid/1)
    |> Enum.filter(fn e -> e != {:error, :cant_parse} end) # it should mean the process died, we warn in logs about this situation
    |> Enum.sum
    Logger.info "Mem usage for session #{session_id |> to_string} is #{res |> to_string} %"
    res
  end


  ## Private
  
  defp get_cpu_of_pid(pid) do
    cores_no = get_cores_no()
    get_resource_of_pid(pid, "cpu") / cores_no
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
    res = :os.cmd(cmd |> String.to_atom)
    |> to_string
    |> Float.parse
    case res do
      {val, "\n"} ->
        val
      _ ->
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


  defp create_tmp_dir, do: File.mkdir!(tmp_dir())


end
