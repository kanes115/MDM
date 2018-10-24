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
    # if the NIF can't be loaded, this function is called instead.
    exit(:nif_library_not_loaded)
  end
end
