defmodule MDMMinion.BackendNif do
  @on_load { :init, 0 }

  app = Mix.Project.config[:app]

  # loading the NIF
  def init do
    path = :filename.join(:code.priv_dir(unquote(app)), 'backend_nif')
    :ok = :erlang.load_nif(path, 0)
  end

  @spec halo() :: :ok
  def halo() do
    exit(:nif_library_not_loaded)
  end

  @spec run_service(String.t, String.t) :: :ok
  def run_service(_service_dir, _exec_path) do
    exit(:nif_library_not_loaded)
  end


end
