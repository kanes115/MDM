defmodule MDMMinion.Deployer do
  use GenServer
  require Logger

  @type reason :: atom() # TODO be more specific

  @callback save_file(File.io_device()) :: :ok | :error
  @callback start() :: :ok | {:error, reason()}


  def start_link() do
    GenServer.start_link(__MODULE__, :ignore, name: __MODULE__)
  end

  ## GenServer callbacks

  def init(_) do
    b = get_backend()
    # TODO what if unknown backend?
    b.start()
    {:ok, %{backend: b}}
  end

  def handle_call({:save_file, file}, _from, %{backend: b} = s) do
    case b.save_file(file) do
      {:ok, _bytes_copied} ->
        {:reply, :ok, s}
      {:error, reason} ->
        {:reply, {:error, reason}, s}
    end
  end


  defp get_backend do
    case :os.type do
      {:unix, :linux} -> MDMMinion.LinuxDeployerBackend
      _ -> :undefined
    end
  end


end
