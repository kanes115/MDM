defmodule MDM.DeployDecider do

  alias MDM.JmmsrParser

  @type decision :: {:ok, [{MDM.Service, MDM.Machine}]}

  @callback decide(JmmsrParser.jmmsr()) :: decision() | {:decision_not_made, reason :: String.t}

  def decide(jmmsr) do
    jmmsr |> get_backend().decide
  end

  def get_backend, do: MDM.DeployDeciderSimple

end
