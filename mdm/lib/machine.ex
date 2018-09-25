defmodule MDM.Machine do

  @behaviour MDM.JmmsrElement

  @type os :: :debian | :linux

  @type machine :: %__MODULE__{
    name: String.t,
    id: integer(),
    ip: String.t,
    domain: String.t,
    ssh_host: String.t,
    os: os()
  }

  defstruct [:name, :id, :ip, :domain, :ssh_host, :os]

  ## JmmsrElement callbacks

  @spec from_map(map()) :: machine()
  def from_map(map), do: struct(__MODULE__, map)

  @spec to_map(machine()) :: map()
  def to_map(machine), do: Map.from_struct(machine)

  def key, do: :machines
  def list?, do: true


  ## API

  def address(%__MODULE__{ip: ip, domain: nil}), do: ip
  def address(%__MODULE__{ip: nil, domain: domain}), do: domain

end
