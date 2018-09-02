defmodule MDM.Command do

  defmodule Request do
    defstruct [:id, :command_name, :body]

    def new_req(command_name, body) do
      %__MODULE__{id: make_ref(), command_name: command_name, body: body}
    end

    def from_json(%{"command_name" => command, "body" => body}) do
      new_req(command, body)
    end
    def from_json(_), do: :error

  end

  defmodule Response do

    alias MDM.Command.Request

    @type msg :: :ok | :error
    defstruct [:id, :msg, :body]

    @spec new_answer(%Request{}, msg(), term()) :: %__MODULE__{}
    def new_answer(%Request{id: id}, msg, body) do
      %__MODULE__{id: id, msg: msg, body: body}
    end

    def to_json(%__MODULE__{msg: msg, body: body}) do
      %{"msg" => msg, body: body}
    end

  end


end
