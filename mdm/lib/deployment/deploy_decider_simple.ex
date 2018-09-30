defmodule MDM.DeployDeciderSimple do
  @behaviour MDM.DeployDecider

  alias MDM.Jmmsr
  alias MDM.Service
  alias MDM.Machine

  def decide(jmmsr) do
    machines = Jmmsr.get_machines(jmmsr)
    services = Jmmsr.get_services(jmmsr)
    res = services
    |> Enum.map(fn s -> {s, get_machine(machines, s)} end)
    {:ok, res}
  end

  defp get_machine(machines, service) do
    # in simple decider we assume user mapped services-machines one-to-one
    [machine_id] = Service.get_available_machines(service)
    Machine.find_machine_by_id(machines, machine_id)
  end

end
