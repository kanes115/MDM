defmodule MDM.JmmsrParser.ServicesParser do

  def check(%{"services" => services}) when is_list(services) do
    :ok
  end
  def check(%{"services" => _}), do: {:error, :services_not_list}
  def check(_), do: {:error, :services_undefined}


end
