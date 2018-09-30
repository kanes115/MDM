defmodule MDMMinion.LinuxDeployerBackend do
  @behaviour MDMMinion.Deployer
  require Logger

  ## Deployer callbacks
  
  def start, do: create_tmp_dir()

  def save_file(file) do
    Logger.info("Copying...")
    File.copy(file, tmp_file_path()) |> IO.inspect
  end

  ## Private

  defp tmp_dir, do: "~/tmp_mdm/" |> Path.expand
  defp tmp_file_path, do: "#{tmp_dir()}/service.tar"


  defp create_tmp_dir, do: File.mkdir!(tmp_dir())


end
