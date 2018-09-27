defmodule MDM.DeployDecider do

  alias MDM.JmmsrParser

  @type decision :: [{MDM.Service, MDM.Machine}]

  @callback decide(JmmsrParser.jmmsr()) :: decision()

  def decide(jmmsr) do
    jmmsr |> get_backend().decide
  end

  def get_backend, do: MDM.DeployDeciderSimple

end
