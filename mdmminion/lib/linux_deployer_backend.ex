defmodule MDMMinion.LinuxDeployerBackend do
  @behaviour MDMMinion.Deployer
  @behaviour MDMMinion.Service
  require Logger

  ## Deployer callbacks
  
  def start, do: create_tmp_dir()

  def save_file(file, prefix) do
    Logger.info("Copying...")
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

  ## Private
  
  defp generate_service_dir_name(s), do: s

  defp tmp_dir, do: "~/tmp_mdm/" |> Path.expand
  defp tmp_file_path(prefix), do: "#{tmp_dir()}/#{prefix}_service.tar"
  defp services_dir, do: "~/mdm_services/" |> Path.expand


  defp create_tmp_dir, do: File.mkdir!(tmp_dir())


end
