defmodule MDM.Service do
  @behaviour MDM.JmmsrElement

  alias MDM.CommonTypes, as: Types

  @type t :: %__MODULE__{
    name: String.t,
    service_dir: Types.path(),
    service_executable: Types.path(),
    containerized: boolean(),
    requirements: %{
      os: [Types.os()],
      ram: non_neg_integer() | nil,
      hdd: non_neg_integer() | nil,
      available_machines: [integer()] # empty means "every machine"
    }
  }

  defstruct [:name, :service_dir, :service_executable, :containerized,
             :requirements]


  ## JmmsrElement callbacks

  @spec from_map(map()) :: t()
  def from_map(map), do: struct(__MODULE__, map)

  @spec to_map(t()) :: map()
  def to_map(service), do: Map.from_struct(service)

  def key, do: :services
  def list?, do: true

  ## API
  
  def get_available_machines(%__MODULE__{requirements: %{available_machines: a}}),
  do: a

  def get_name(%__MODULE__{name: n}), do: n
  
  def get_service_path(%__MODULE__{service_dir: d}), do: d


end
