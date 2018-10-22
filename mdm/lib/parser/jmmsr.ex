defmodule MDM.Jmmsr do

  @type t :: %{services: [MDM.Service.t],
               machines: [MDM.Machine.t],
               connections: [map()],
               config: map(),
               live_metrics: [map()]}

  defstruct [:services, :machines, :connections, :config, :live_metrics]

  def new(map) do
    with {:ok, jmmsr} <- MDM.JmmsrParser.to_internal_repr(map, jmmsr_elements())
    do
      {:ok, struct(__MODULE__, jmmsr)}
    end
  end

  def get_machines(%__MODULE__{machines: m}), do: m

  def get_services(%__MODULE__{services: s}), do: s
  
  
  defp jmmsr_elements, do: [MDM.Machine, MDM.Service]


end
