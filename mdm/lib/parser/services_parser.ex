defmodule MDM.JmmsrParser.ServicesParser do

  alias MDM.JmmsrParser.Utils

  defp reqs, do: [{"os", {&list_of_known_os?/1, :unknown_os}},
                  {"HDD", &is_integer/1},
                  {"RAM", &is_integer/1},
                  {"available_machines", &Utils.list_of_ints?/1}] # TAke from Utils

  def check(json) do
    with true <- Utils.check_values(json, ["services", "name"],
                                    &is_bitstring/1),
         true <- Utils.check_values(json, ["services", "containerized"],
                                   &is_boolean/1),
         true <- Utils.check_values(json, ["services", "requirements"],
                                    &is_map/1, false),
         true <- check_reqs(json),
         true <- check_dirs(json), do: :ok
  end



  defp list_of_known_os?(oses) when is_list(oses) do
    oses |> Enum.all?(&Utils.known_os?/1)
  end

  defp check_reqs(json) do
    res = reqs()
    |> Enum.map(fn {req, pred} -> Utils.check_values(json,
                                                    ["services", "requirements", req],
                                                    pred, 
                                                    false) end)
    case res |> Enum.all?(fn e -> e == true end) do
      true -> true
      false -> Utils.take_first_error(res)
    end
  end

  defp check_dirs(json) do
    base_path = ["services", "requirements"]
    with true <- Utils.check_values(json, base_path ++ ["service_dir"],
                                    &Utils.is_path/1, false),
         true <- Utils.check_values(json, base_path ++ ["service_executable"],
                                    &Utils.is_path/1, false), do: true
  end

end
