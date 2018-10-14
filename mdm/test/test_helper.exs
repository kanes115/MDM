ExUnit.start()

defmodule MDMRpc do
  @type entity :: :pilot | :minion1 | :minion2

  def call(entity, module, func, args) do
    node_name = entity_to_node(entity)
    :rpc.call(node_name, module, func, args)
  end

  def all_call(module, func, args) do
    entities()
    |> Enum.map(fn entity -> call(entity, module, func, args) end)
  end

  def get_minion1_ip do
    {:ok, {:hostent, 'minion1', [], :inet, 4, [ip_tuple]}} =
      :inet_res.getbyname("minion1" |> to_charlist, :a)
    to_string(:inet_parse.ntoa(ip_tuple))
  end

  defp entity_to_node(:pilot), do: :"pilot@pilot.com"
  defp entity_to_node(:minion1), do: :"minion@#{get_minion1_ip()}"
  defp entity_to_node(:minion2), do: :"minion@minion2.com"

  defp entities, do: [:pilot, :minion1, :minion2]

end

defmodule WebSocket do
  use WebSockex
  require Logger

  def start(url, report_to) do
    WebSockex.start(url, __MODULE__, report_to, name: __MODULE__)
  end


  def start_anonymous(url) do
    WebSockex.start(url, __MODULE__, :ignored)
  end

  def close do
    WebSockex.send_frame(__MODULE__, :close)
    WebSockex.cast(__MODULE__, :close)
  end

  def send_text(text) do
    WebSockex.send_frame(__MODULE__, {:text, text})
  end

  def receive do
    receive do
      msg -> msg
    end
  end

  def handle_frame({type, msg}, report_to) do
    send report_to, msg
    {:ok, report_to}
  end

  def handle_cast(:close, state) do
    {:stop, :normal, state}
  end
  def handle_cast({:send, {type, msg} = frame}, state) do
    {:reply, frame, state}
  end

  def terminate(reason, _state) do
    exit(:normal)
  end
 
end



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

  def add_to_list(jmmsr, list_path, element) do
    list = jmmsr
           |> pop_in(list_path)
           |> elem(0)
    new_list = [element | list]

    jmmsr
    |> put_in(list_path, new_list)
  end

end
