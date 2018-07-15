defmodule MDM.JmmsrParser.ServicesParser do

  def check(%{"services" => services}) when is_list(services) do
    results = for s <- services, do: {s, s}
    Utils.take_first_error(results)
  end
  def check(%{"services" => _}), do: {:error, :services_not_list}
  def check(_), do: {:error, :services_undefined}

end
