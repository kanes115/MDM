defmodule MDMMinion.NethogsExecutor do
  use GenServer
  require Logger

  # This needs to be that long because of the way nethogs works.
  # It approaches the correct value...
  @interval 5 # seconds

  def ensure_started do
    case __MODULE__ in Process.registered() do
      true ->
        :ok
      false ->
        GenServer.start(__MODULE__, :ingored, name: __MODULE__)
    end
  end

  def get_per_pid_net_stats do
    case :ets.lookup(:nethogs_results, :last) do
      [{:last, results}] -> results
      [] -> []
    end
  end

  def init(state) do
    send self(), :update_nethogs_result
    :ets.new(:nethogs_results, [:set, :public, :named_table])
    {:ok, state}
  end

  def handle_info(:update_nethogs_result, state) do
    cmd = "nethogs -tc 2 -d #{@interval} 2> /dev/null | awk '{$1=$1};1'"
    res = :os.cmd(cmd |> String.to_atom)
    |> to_string
    |> String.split("\nRefreshing:\n")
    |> Enum.at(2)
    |> String.split("\n")
    |> Enum.filter(fn e -> e != "" end) # Splitting on newline leaves one empty string
    |> Enum.map(&parse_nethogs_line/1)
    |> Enum.filter(fn e -> e != :unknown end)
    :ets.insert(:nethogs_results, {:last, res})
    send self(), :update_nethogs_result
    {:noreply, state}
  end


  @spec parse_nethogs_line(String.t) :: {pid :: integer(), net_in :: float(), net_out :: float()} | :unknown
  defp parse_nethogs_line("unknown" <> _), do: :unknown # there is a collective net stat for unknonwn pids, we omit it
  defp parse_nethogs_line(line) do
    try do
      [process, out, inn] = line
                            |> String.split(" ")
                            |> take_last_n(3)
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
      e ->
        Logger.warn "Could not parse nethogs line. Ignoring this entry (error: #{inspect(e)}\nfor line: #{inspect(line)})"
        :unknown
    end
  end

  defp take_last_n(list, n) do
    list
    |> Enum.reverse
    |> Enum.take(n)
    |> Enum.reverse
  end

end
