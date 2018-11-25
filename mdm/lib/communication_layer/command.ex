defmodule MDM.Command do

  @moduledoc """
  This module holds structs that are an abstraction level over messages
  that go through WS. For now we've got Request (that client app issues)
  and Respones to that requests. We are planning on adding something that
  informs about update of metric or connection with target machines.
  This module's purpose is to diffrentiate between differen messages
  and to provide structured metadata.

  """

  defmodule Request do
    defstruct [:command_name, :body]

    @type t :: %Request{command_name: atom(), body: map()}

    @spec from_json(%{command_name: String.t, body: map()}) :: t
    def from_json(%{"command_name" => command, "body" => body}) do
      case to_command_name(command) do
        {:error, :unknown_command} -> :unknown_command
        command_name -> new_req(command_name, body)
      end
    end
    def from_json(_), do: :error

    defp new_req(command_name, body) do
      %__MODULE__{command_name: command_name, body: body}
    end

    # Mybe this should be in subscribers somehow?
    defp to_command_name("deploy"), do: :deploy
    defp to_command_name("collect_data"), do: :collect_data
    defp to_command_name("check_correctness"), do: :check_correctness
    defp to_command_name("stop_system"), do: :stop_system
    defp to_command_name("get_active_system"), do: :get_active_system
    defp to_command_name(_), do: {:error, :unknown_command}

  end

  defmodule Response do

    alias MDM.Command.Request

    @type msg :: :ok | :error
    @type t :: %Response{msg: msg(), body: map()}
    defstruct [:command_name, :msg, :code, :body]

    @spec new_answer(Request.t, integer(), msg(), term()) :: t
    def new_answer(%Request{command_name: command_name}, msg, code, body) do
      %__MODULE__{command_name: command_name, msg: msg, code: code, body: body}
    end

    def error_response(req, code), do: error_response(req, code, %{})
    def error_response(nil, code, body) do
      %__MODULE__{code: code, msg: "error", body: body}
    end
    def error_response(%Request{command_name: command_name}, code, body) do
      %__MODULE__{command_name: command_name, code: code, msg: "error", body: body}
    end

    # For situations where request was malformed
    def response_command_malformed(body \\ %{}) do
      error_response(nil, 400, body)
    end

    def response_internal_error(body \\ %{}) do
      error_response(nil, 500, body)
    end

    @spec to_json(t) :: map()
    def to_json(%__MODULE__{command_name: nil, msg: msg, body: body, code: code}) do
      %{msg: msg, code: code, body: body}
    end
    def to_json(%__MODULE__{command_name: command_name, msg: msg, body: body, code: code}) do
      %{command_name: command_name, msg: msg, code: code, body: body}
    end


  end


end
