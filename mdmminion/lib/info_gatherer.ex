defmodule MDMMinion.InfoGatherer do
  use GenServer

  alias MDMMinion.LinuxGathererBackend

  require Logger

  @callback machine_cpu_max :: integer()

  def start_link(), do: GenServer.start_link(__MODULE__, :ignored, name: __MODULE__)

  def init(_) do
    {:ok, %{gatherer_backend: get_backend()}}
  end

  def handle_call(:get_info, _from, state) do
    gatherer_backend = backend(state)
    data = collect_data(gatherer_backend)
    {:reply, {:ok, data}, :ignored}
  end

  def collect_data(backend) do
    %{
      cpu: backend.machine_cpu_max
    }
  end

  defp get_backend do
    case :os.type do
      {:unix, :linux} -> LinuxGathererBackend
      _ -> :undefined
    end
  end

  defp backend(%{gatherer_backend: backend}), do: backend

end
