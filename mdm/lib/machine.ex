defmodule MDM.Machine do

  @behaviour MDM.JmmsrElement

  @type os :: :debian | :linux

  @type machine :: %__MODULE__{
    name: String.t,
    id: integer(),
    ip: String.t,
    domain: String.t,
    ssh_host: String.t,
    os: os(),
    resources: map()
  }

  defstruct [:name, :id, :ip, :domain, :ssh_host, :os, :resources]

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

  def add_resources(machine, resources), do: %{machine | resources: resources}

  def find_machine_by_address(machines, address) do
    case machines |> Enum.filter(fn machine -> of_address?(machine, address) end) do
      [] -> :not_found
      [machine] -> machine
    end
  end

  defp of_address?(machine, addr), do: addr== address(machine)

end
