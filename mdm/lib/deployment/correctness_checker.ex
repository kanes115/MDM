defmodule MDM.CorrectnessChecker do
  use GenServer

  alias MDM.Command.Request
  alias MDM.Command.Response


  def start_link() do
    GenServer.start_link(__MODULE__, :ingnored, name: __MODULE__)
  end

  def commands do
    [:check_correctness]
  end

  def init(state) do
    {:ok, state}
  end


  def handle_call(%Request{command_name: :check_correctness, body: jmmsr} = req, _, _) do
    resp = case MDM.JmmsrParser.check_correctness(jmmsr) do
      :ok ->
        req |> Response.new_answer("checked", 200, %{"is_ok" => true})
      {:error, path, reason} ->
        req |> Response.new_answer("checked", 200, %{"is_ok" => false,
          "path" => path,
          "reason" => reason})
    end
    {:reply, resp, :ignored}
  end

end
