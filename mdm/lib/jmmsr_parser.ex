defmodule MDM.JmmsrParser do

  defmodule ConfigParser do

    @available_metrics ["cpuUsage"] # TODO determine

    def check_config(%{"config" => conf}) do
      with :ok <- check_metrics(conf),
           :ok <- check_persist(conf),
           :ok <- check_pilot(conf), do: :ok
    end
    def check_config(_), do: {:error, :config_not_specified}

    defp check_metrics(%{"metrics" => metrics}) when is_list(metrics) do
      case Enum.all?(metrics, fn e -> Enum.member?(@available_metrics, e) end) do
        true -> :ok
        _ -> {:error, :unknown_metric}
      end
    end
    defp check_metrics(%{"metrics" => _}), do: {:error, :metrics_value_not_a_list}
    defp check_metrics(_), do: {:error, :metrics_not_found}

    defp check_persist(%{"persist" => true, "persist_machine" => id}) when is_integer(id), do: :ok
    defp check_persist(%{"persist" => true, "persist_machine" => _id}), do: {:error, :machine_id_not_int}
    defp check_persist(%{"persist" => false, "persist_machine" => _}) do
      #print warning
      :ok
    end
    defp check_persist(%{"persist" => false}), do: :ok
    defp check_persist(_), do: {:error, :persist_flag_not_set}

    defp check_pilot(%{"pilot_machine" => id}) when is_integer(id), do: :ok
    defp check_pilot(%{"pilot_machine" => _}), do: {:error, :machine_id_not_int}
    defp check_pilot(_), do: {:error, :pilot_not_set}

  end

  defmodule MachinesParser do

    @supported_os ["debian", "linux"]

    def check_machines(%{"machines" => machines}) when is_list(machines) do
      results = for m <- machines, do: {m, check_machine(m)}
      case take_first_error(results) do
        :ok -> check_id_uniqueness(machines)
        {machine, {:error, reason}} -> {:error, %{trouble_entry: machine, reason: reason}}
      end
    end
    def check_machines(%{"machines" => _}), do: {:error, :machines_not_a_list}
    def check_machines(_), do: {:error, :machines_undefined}

    defp check_machine(machine) do
      with :ok <- check_name(machine),
           :ok <- check_id(machine),
           :ok <- check_address(machine),
           :ok <- check_os(machine), do: :ok
    end

    defp check_name(%{"name" => s}) when is_bitstring(s), do: :ok
    defp check_name(%{"name" => _}), do: {:error, :machine_name_not_string}
    defp check_name(_), do: :ok

    defp check_id(%{"id" => i}) when is_integer(i), do: :ok
    defp check_id(%{"id" => _}), do: {:error, :machine_id_not_int}
    defp check_id(_), do: {:error, :id_undefined}

    defp check_address(%{"ip" => _, "domain" => _}), do: {:error, :ip_and_domain_sepcified}
    defp check_address(%{"ip" => ip}) do
      case correct_ip_format?(ip) do
        true -> :ok
        false -> {:error, :incorrect_ip_format}
      end
    end
    defp check_address(%{"domain" => d}) do
      case correct_domain_name_format(d) do
        true -> :ok
        false -> {:error, :incorrect_domain_format}
      end
    end
    defp check_address(_), do: {:error, :address_undefined}

    defp check_os(%{"os" => os}) when is_bitstring(os) do
      case Enum.member?(@supported_os, os) do
        true -> :ok
        false -> {:error, :os_not_supported}
      end
    end
    defp check_os(%{"os" => _}), do: {:error, :os_not_string}
    defp check_os(_), do: {:error, :os_undefined}

    defp correct_ip_format?(s), do: is_bitstring(s) # TODO

    defp correct_domain_name_format(s), do: is_bitstring(s) #TODO

    defp take_first_error([]), do: :ok
    defp take_first_error([{_machine, :ok} | tail]), do: take_first_error(tail)
    defp take_first_error([{_machine, {:error, _}} = error | _]), do: error

    # TODO probably can be more idiomatic
    defp check_id_uniqueness(machines) do
      uniq_l = machines
      |> Enum.map(fn %{"id" => id} -> id end)
      |> Enum.uniq
      |> length
      case length(machines) do
        ^uniq_l -> :ok
        _ -> {:error, :machine_id_duplication}
      end
    end
  end


  # TODO recursively
  defp keys_to_atoms(json) do
    for {key, val} <- json, into: %{}, do: {String.to_atom(key), val}
  end

  def from_file(path) do
    with {:ok, body} <- File.read(path),
         {:ok, json} <- Poison.decode(body),
         :ok <- check_correctness(json), do: {:ok, json}
  end

  defp check_correctness(json) do
    with :ok <- ConfigParser.check_config(json),
         :ok <- MachinesParser.check_machines(json)
    do
      :ok
    else
      error ->
        print_error(error)
        :error
    end
  end

  # TODO use Lagger
  defp print_error({:error, %{reason: reason, trouble_entry: entry}}) do
    IO.puts "Error parsing for reason #{inspect(reason)}. Entry: #{inspect(entry)}"
  end
  defp print_error({:error, %{reason: reason}}) do
    IO.puts "Error parsing for reason #{inspect(reason)}."
  end
  defp print_error({:error, reason}) when is_atom(reason) do
    print_error({:error, %{reason: reason}})
  end


end
