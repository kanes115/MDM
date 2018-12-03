defmodule MDM.DeployDecider do

  alias MDM.JmmsrParser

  @type decision :: [{MDM.Service, MDM.Machine}]

  @callback decide(JmmsrParser.jmmsr()) :: {:ok, decision()}
                    | {:decision_not_made, reason :: String.t}

  def decide(jmmsr) do
    get_backend().decide(jmmsr)
  end

  def get_backend, do: Application.get_env(:mdm, :deploy_decider, MDM.DeployDeciderSimple)

  def to_body(decision) do
    decision
    |> Enum.map(fn {service, machine} ->
      %{"service" => MDM.Service.get_name(service), "machine" => MDM.Machine.get_id(machine)} end)
  end

end
