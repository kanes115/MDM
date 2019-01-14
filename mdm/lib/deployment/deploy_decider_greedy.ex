defmodule MDM.DeployDeciderGreedy do
  @behaviour MDM.DeployDecider

  @moduledoc """
  This decider gets first machine with the highest (cores / already_assigned_services) ratio for each service
  which requirements (mem, cpu freq and os) are met.
  """

  alias MDM.Jmmsr
  alias MDM.Service
  alias MDM.Machine

  def decide(jmmsr) do
    machines = Jmmsr.get_machines(jmmsr) |> Enum.map(&give_core_points/1)
    services = Jmmsr.get_services(jmmsr)
    case assign_services_to_machines(services, machines, []) do
      {:decision_not_made, _} = res -> res
      res ->
      {:ok, res}
    end
  end

  defp assign_services_to_machines([], machines_with_pts, result) do
    result
  end
  defp assign_services_to_machines([service | services], machines_with_pts, result) do
    machines_with_pts |> Enum.map(fn {m, pts} -> pts end)
    matching =
    machines_with_pts
    |> Enum.filter(fn {m, pts} -> fits?(m, pts, service) end)
    |> Enum.sort(fn {_, pts}, {_, pts2} -> pts >= pts2 end)

    case matching do
      [] ->
        {:decision_not_made, :no_matching_machine_for_service}
      [{found, _} | _] ->
        assign_services_to_machines(services,
                                    decrease_machines_points(machines_with_pts, found),
                                    [{service, found} | result])
    end
  end

  defp decrease_machines_points(machines_with_pts, machine) do
    Enum.map(machines_with_pts, fn {^machine, pts} -> {machine, pts - 1}
                                    e -> e end)
  end

  defp error?({_, :error}), do: true
  defp error?(_), do: false

  defp fits?(machine, 0, service) do
    false
  end
  defp fits?(machine, pts, service) do
    res = Machine.get_resources(machine)
    req = Service.get_requirements(service)
    # provided units must conform to what we use in resources, TODO: make gui send units?
    (res.os |> elem(0)) in Enum.map(req.os, fn b -> :erlang.binary_to_atom(b, :utf8) end) and # TODO make sure the types are converted in parser!
    res.mem |> elem(0) >= req.ram and
    res.hdd  |> elem(0) >= req.hdd and
    Machine.get_id(machine) in req.available_machines
  end

  defp give_core_points(machine) do
    res = Machine.get_resources(machine)
    {machine, res.cpu_cores |> elem(0)}
  end


end
