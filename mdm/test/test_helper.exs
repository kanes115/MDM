ExUnit.start()

defmodule JmmsrHelpers do

  def live_metric({:machine, machine_id}, metric_name, {val, unit}) do
    %{
      "for_machine" => true,
      "metric" => metric_name,
      "machine_id" => machine_id,
      "unit" => unit,
      "value" => val
    }
  end
  def live_metric({:service, service_name}, metric_name, {val, unit}) do
    %{
      "for_machine" => false,
      "metric" => metric_name,
      "service_name" => service_name,
      "unit" => unit,
      "value" => val
    }
  end


  def connection(from, to, port \\ 80) do
    %{
      "port" => port,
      "service_from" => from,
      "service_to" => to
    }
  end

  def machine(name, id, os \\ "linux", address \\ [{"ip", "192.168.1.1"}], ssh_host \\ "some_host_from_ssh_config") do
    %{
      "id" => id,
      "name" => name,
      "os" => os
    }
    |> add_address(address)
    |> Map.put("ssh_host", ssh_host)
  end

  def add_address(machine, addresses) do
    Enum.reduce(addresses,
                machine,
                fn {k, v}, m -> Map.put(m, k, v) end)
  end

  def service(name, available_machines \\ [], service_dir \\ "/some/path/to/directory") do
    %{
      "containerized" => true,
      "name" => name,
      "requirements" => %{
        "HDD" => 242,
        "RAM" => 453,
        "available_machines" => available_machines,
        "os" => ["linux"]
      },
      "service_dir" => service_dir,
      "service_executable" => "./start.sh"
    }
  end

end
