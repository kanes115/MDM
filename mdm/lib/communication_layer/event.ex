defmodule MDM.Event do

  defstruct [:event_name, :body]

  @type t :: %__MODULE__{event_name: atom(), body: map()}

  @spec to_json(t) :: map()
  def to_json(%__MODULE__{event_name: event_name, body: body}) do
    %{event_name: Atom.to_string(event_name), body: body}
  end

  @spec new_event(atom(), map()) :: t
  def new_event(event_name, body) do
    %__MODULE__{event_name: event_name, body: body}
  end


end
