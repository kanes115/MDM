defmodule MDM.Machine do

  @behaviour MDM.JmmsrElement

  alias MDM.CommonTypes, as: Types

  @type resources :: %{cpu: Types.single_resource(),
                       mem: Types.single_resource()}

  @type t :: %__MODULE__{
    name: String.t,
    id: integer(),
    ip: String.t,
    domain: String.t,
    ssh_host: String.t,
    os: Types.os(),
    resources: Types.resources()
  }

  defstruct [:name, :id, :ip, :domain, :ssh_host, :os, :resources]

  ## JmmsrElement callbacks

  @spec from_map(map()) :: t()
  def from_map(map), do: struct(__MODULE__, map)

  @spec to_map(t()) :: map()
  def to_map(machine) do
    machine
    |> Map.from_struct
    |> convert_resources
  end

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

  def find_machine_by_id(machines, id) do
    case machines |> Enum.filter(fn %__MODULE__{id: this_id} -> this_id == id end) do
      [] -> :not_found
      [machine] -> machine
    end
  end

  defp of_address?(machine, addr), do: addr== address(machine)

  defp convert_resources(%{resources: nil} = map), do: map
  defp convert_resources(%{resources: res} = map) do
    new_res = res
              |> Enum.map(fn {k, {val, unit}} -> {k, %{val: val, unit: unit}} end)
              |> Enum.into(%{})
    %{map | resources: new_res}
  end

end
