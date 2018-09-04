defmodule MDM.Command do

  defmodule Request do
    defstruct [:id, :command_name, :body]

    @type t :: %Request{id: identifier(), command_name: atom(), body: map()}

    @spec from_json(%{"command_name": String.t, "body": map()}) :: t
    def from_json(%{"command_name" => command, "body" => body}) do
      case to_command_name(command) do
        :error -> :error
        command_name -> new_req(command_name, body)
      end
    end
    def from_json(_), do: :error

    defp new_req(command_name, body) do
      %__MODULE__{id: make_ref(), command_name: command_name, body: body}
    end

    # Mybe this should be in Deployer?
    defp to_command_name("deploy"), do: :deploy
    defp to_command_name(_), do: :error

  end

  defmodule Response do

    alias MDM.Command.Request

    @type msg :: :ok | :error
    @type t :: %Response{id: identifier(), msg: msg(), body: map()}
    defstruct [:id, :msg, :code, :body]

    @spec new_answer(Request.t, integer(), msg(), term()) :: t
    def new_answer(%Request{id: id}, msg, code, body) do
      %__MODULE__{id: id, msg: msg, code: code, body: body}
    end

    @spec to_json(t) :: map()
    def to_json(%__MODULE__{msg: msg, body: body, code: code}) do
      %{msg: msg, code: code, body: body}
    end

    def error_response(code, body \\ %{}) do
      %{"code" => code, "msg" => "error", "body" => body}
    end

  end


end
