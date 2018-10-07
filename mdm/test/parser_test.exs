defmodule ParserTest do
  use ExUnit.Case
  doctest MDM
  alias MDM.JmmsrParser
  import JmmsrHelpers

  @tmp_file "/tmp/tmp_file.mdm"
  @not_existing_machine_id 429587493759
  @not_existing_service_name "some not exitsting service"

  # TODO clean tmp file

  test "Correct jmmsr is parsed without error" do
    with_mdm(correct_jmmsr())
    {:ok, json} = JmmsrParser.from_file @tmp_file
    assert is_map(json)
  end

  ## Config tests

  test "Type mismatch is detected at config, persist" do
    correct_jmmsr()
    |> put_in(["config", "persist"], "ala")
    |> with_mdm
    {:error, path, reason} = JmmsrParser.from_file @tmp_file
    assert reason == :type_mismatch
    assert path == "config, persist"
  end

  test "Type mismatch is detected at config_perists_machine" do
    correct_jmmsr()
    |> put_in(["config", "persist_machine"], "32")
    |> with_mdm
    {:error, path, reason} = JmmsrParser.from_file @tmp_file
    assert path == "config, persist_machine"
    assert reason == :type_mismatch
  end

  test ":not_found detected when config -> pilot_machine is missing" do
    correct_jmmsr()
    |> pop_in(["config", "pilot_machine"])
    |> elem(1)
    |> with_mdm
    {:error, path, reason} = JmmsrParser.from_file @tmp_file
    assert path == "config, pilot_machine"
    assert reason == :not_found
  end

  test "If persist == true persist_machine need not be" do
    correct_jmmsr()
    |> put_in(["config", "persist"], false)
    |> pop_in(["config", "persist_machine"])
    |> elem(1)
    |> with_mdm
    {:ok, json} = JmmsrParser.from_file @tmp_file
    assert is_map(json)
  end

  # TODO capture warning
  test "If persist == false persist_machine can still be" do
    correct_jmmsr()
    |> put_in(["config", "persist"], false)
    |> with_mdm
    {:ok, json} = JmmsrParser.from_file @tmp_file
    assert is_map(json)
  end

  test "If there's unknown metric in config -> metrics we give error" do
    correct_jmmsr()
    |> put_in(["config", "metrics"], ["some_unknown_metric"])
    |> with_mdm
    {:error, path, reason} = JmmsrParser.from_file @tmp_file
    assert path == "config, metrics"
    assert reason == :unknown_metric
  end

  test "No config" do
    correct_jmmsr()
    |> pop_in(["config"])
    |> elem(1)
    |> with_mdm
    {:error, path, reason} = JmmsrParser.from_file @tmp_file
    assert path == "config"
    assert reason == :not_found
  end


  # Machines
  
    test "Type mismatch is detected when machines name is int" do
      correct_jmmsr()
      |> update_first(["machines"], ["name"], 22)
      |> with_mdm

      {:error, path, reason} = JmmsrParser.from_file @tmp_file
      assert path == "machines, name"
      assert reason == :type_mismatch
    end
  
    test "Type mismatch is detected when machines id is bool" do
      correct_jmmsr()
      |> update_first(["machines"], ["id"], true)
      |> with_mdm
      {:error, path, reason} = JmmsrParser.from_file @tmp_file
      assert path == "machines, id"
      assert reason == :type_mismatch
    end
  
    test ":no_address is detected when neither IP nor domain is specified" do
      correct_jmmsr()
      |> update_first(["machines"], ["ip"], nil)
      |> update_first(["machines"], ["domain"], nil)
      |> with_mdm
      {:error, path, reason} = JmmsrParser.from_file @tmp_file
      assert path == "machines"
      assert reason == :no_address
    end
  
    test ":unknown_os is detected when os is not one of linux or debian" do
      correct_jmmsr()
      |> update_first(["machines"], ["os"], "llll")
      |> with_mdm
      {:error, path, reason} = JmmsrParser.from_file @tmp_file
      assert path == "machines, os"
      assert reason == :unknown_os
    end
  
    test ":two_addresses is detected when both IP and domain is specified" do
      correct_jmmsr()
      |> update_first(["machines"], ["ip"], nil)
      |> update_first(["machines"], ["domain"], nil)
      |> update_first(["machines"], ["domain"], "www.a.pl")
      |> update_first(["machines"], ["ip"], "192.199.199.1")
      |> with_mdm
      {:error, path, reason} = JmmsrParser.from_file @tmp_file
      assert path == "machines"
      assert reason == :two_addresses
    end
  
    test ":not_found is detected when there is no machines" do
      correct_jmmsr()
      |> pop_in(["machines"])
      |> elem(1)
      |> with_mdm
      {:error, path, reason} = JmmsrParser.from_file @tmp_file
      assert path == "machines"
      assert reason == :not_found
    end

    test ":not_found is detected when there is no ssh_host" do
      correct_jmmsr()
      |> update_first(["machines"], ["ssh_host"], nil)
      |> with_mdm
      {:error, path, reason} = JmmsrParser.from_file @tmp_file
      assert path == "machines, ssh_host"
      assert reason == :not_found
    end

    # Services 
    
    test "Type mismatch is detected when service name is bool" do
      correct_jmmsr()
      |> update_first(["services"], ["name"], true)
      |> with_mdm
      {:error, path, reason} = JmmsrParser.from_file @tmp_file
      assert path == "services, name"
      assert reason == :type_mismatch
    end

    test "Type mismatch is detected when containerized is string" do
      correct_jmmsr()
      |> update_first(["services"], ["containerized"], "false")
      |> with_mdm
      {:error, path, reason} = JmmsrParser.from_file @tmp_file
      assert path == "services, containerized"
      assert reason == :type_mismatch
    end

    test "Type mismatch is detected when requirements is list" do
      correct_jmmsr()
      |> update_first(["services"], ["requirements"], [])
      |> with_mdm
      {:error, path, reason} = JmmsrParser.from_file @tmp_file
      assert path == "services, requirements"
      assert reason == :type_mismatch
    end

    test ":unknown_os is detected when requirements -> os is not one of known oses" do
      correct_jmmsr()
      |> update_first(["services"], ["requirements", "os"], ["lin"])
      |> with_mdm
      {:error, path, reason} = JmmsrParser.from_file @tmp_file
      assert path == "services, requirements, os"
      assert reason == :unknown_os
    end

    test ":type_mismatch is detected when requirements -> HDD is a string" do
      correct_jmmsr()
      |> update_first(["services"], ["requirements", "HDD"], "lin")
      |> with_mdm
      {:error, path, reason} = JmmsrParser.from_file @tmp_file
      assert path == "services, requirements, HDD"
      assert reason == :type_mismatch
    end

    test ":type_mismatch is detected when requirements -> available_machines is not a list of ints" do
      correct_jmmsr()
      |> update_first(["services"], ["requirements", "available_machines"], 3545)
      |> with_mdm
      {:error, path, reason} = JmmsrParser.from_file @tmp_file
      correct_jmmsr()
      |> update_first(["services"], ["requirements", "available_machines"], ["ala", "ma", "kota"])
      |> with_mdm
      {:error, ^path, ^reason} = JmmsrParser.from_file @tmp_file
      assert path == "services, requirements, available_machines"
      assert reason == :type_mismatch
    end

    test "No requirement is compulsory, the key can be ommited then" do
      correct_jmmsr()
      |> update_first(["services"], ["requirements", "os"], nil)
      |> with_mdm
      {:ok, _json} = JmmsrParser.from_file @tmp_file
      correct_jmmsr()
      |> update_first(["services"], ["requirements", "HDD"], nil)
      |> with_mdm
      {:ok, _json} = JmmsrParser.from_file @tmp_file
      correct_jmmsr()
      |> update_first(["services"], ["requirements"], %{})
      |> with_mdm
      {:ok, _json} = JmmsrParser.from_file @tmp_file
    end

    # Connection parser

    test ":type_mismatch is detected when connections -> service_from is not a string" do
      correct_jmmsr()
      |> update_first(["connections"], ["service_from"], 22)
      |> with_mdm
      {:error, path, reason} = JmmsrParser.from_file @tmp_file
      assert path == "connections, service_from"
      assert reason == :type_mismatch
    end

    test ":type_mismatch is detected when connections -> port is bigger than 65000" do
      correct_jmmsr()
      |> update_first(["connections"], ["port"], 3278463)
      |> with_mdm
      {:error, path, reason} = JmmsrParser.from_file @tmp_file
      assert path == "connections, port"
      assert reason == :invalid_port
    end


    # Live metrics parser
    
    test ":not_found is detected when live_metrics -> for_machine set to true but machine_id not set" do
      correct_jmmsr()
      |> update_first(["live_metrics"], ["machine_id"], nil)
      |> update_first(["live_metrics"], ["for_machine"], true)
      |> with_mdm
      {:error, path, reason} = JmmsrParser.from_file @tmp_file
      assert path == "live_metrics, machine_id"
      assert reason == :not_found
    end

    test ":not_found is detected when live_metrics -> for_machine set to false but service_name not set" do
      correct_jmmsr()
      |> update_first(["live_metrics"], ["for_machine"], false)
      |> update_first(["live_metrics"], ["service_name"], nil)
      |> with_mdm
      {:error, path, reason} = JmmsrParser.from_file @tmp_file
      assert path == "live_metrics, service_name"
      assert reason == :not_found
    end

    test ":should_not_be_specified with wrong key in path is detected when live_metrics -> [machine_id | service_name] are both set" do
      correct_jmmsr()
      |> update_first(["live_metrics"], ["machine_id"], 34)
      |> update_first(["live_metrics"], ["service_name"], "some_service1")
      |> with_mdm
      {:error, path, reason} = JmmsrParser.from_file @tmp_file
      assert path == "live_metrics, machine_id"
      assert reason == :should_not_be_specified
    end

    test ":type_mismatch is detected when live_metrics -> machine_id is not int" do
      correct_jmmsr()
      |> update_first(["live_metrics"], ["service_name"], nil)
      |> update_first(["live_metrics"], ["machine_id"], "34")
      |> update_first(["live_metrics"], ["for_machine"], true)
      |> with_mdm
      {:error, path, reason} = JmmsrParser.from_file @tmp_file
      assert reason == :type_mismatch
      assert path == "live_metrics, machine_id"
    end

    test ":unknown_metric is detected when live_metrics -> metric_name is not supported" do
      correct_jmmsr()
      |> update_first(["live_metrics"], ["metric"], "fancy metric")
      |> with_mdm
      {:error, path, reason} = JmmsrParser.from_file @tmp_file
      assert {reason, path} == {:unknown_metric, "live_metrics, metric"}
    end


    # Relations

    test ":not_uniqe is detected when there are two the same services" do
      correct_jmmsr()
      |> add_to_list(["services"], service("the_same"))
      |> add_to_list(["services"], service("the_same"))
      |> with_mdm
      {:error, path, reason} = JmmsrParser.from_file @tmp_file
      assert reason == :not_unique
      assert path == "services"
    end

    test ":undefined_machine is detected when there is a machine specified that is not defined in 'machines' value" do
      undefined_machine_id = 398742895732984573294
      correct_jmmsr()
      |> add_to_list(["services"], service("the_same", [undefined_machine_id]))
      |> with_mdm
      {:error, path, reason} = JmmsrParser.from_file @tmp_file
      assert reason == :undefined_machine
      assert path == "services"
    end

    test ":not_uniqe is detected when there are two the same machines" do
      correct_jmmsr()
      |> add_to_list(["machines"], machine("some machine", 180))
      |> add_to_list(["machines"], machine("with different name only", 180))
      |> with_mdm
      {:error, path, reason} = JmmsrParser.from_file @tmp_file
      assert reason == :not_unique
      assert path == "machines"
    end

    test ":not_uniqe is detected when there are two the same connections" do
      correct_jmmsr()
      |> add_to_list(["services"], service("some_service 1"))
      |> add_to_list(["services"], service("some_service 2"))
      |> add_to_list(["connections"], connection("some_service 1", "some_service 2"))
      |> add_to_list(["connections"], connection("some_service 1", "some_service 2"))
      |> with_mdm
      {:error, path, reason} = JmmsrParser.from_file @tmp_file
      assert {reason, path} == {:not_unique, "connections"}
    end

    test "Parsed correctly if there are two connetions connecting the same services but reversed" do
      correct_jmmsr()
      |> add_to_list(["services"], service("some_service 1"))
      |> add_to_list(["services"], service("some_service 2"))
      |> add_to_list(["connections"], connection("some_service 2", "some_service 1"))
      |> add_to_list(["connections"], connection("some_service 1", "some_service 2"))
      |> with_mdm
      {:ok, jmmsr} = JmmsrParser.from_file @tmp_file
      assert is_map(jmmsr)
    end

    test ":undefined_service is detected when there is a connection with service not being in services list" do
      correct_jmmsr()
      |> add_to_list(["services"], service("some_service 1"))
      |> add_to_list(["connections"], connection(@not_existing_service_name, "some_service 1"))
      |> with_mdm
      {:error, path, reason} = JmmsrParser.from_file @tmp_file
      assert {reason, path} == {:undefined_service, "connections"}
    end

    test ":undefined_service is detected when there is a live_metric with service not being in services list" do
      correct_jmmsr()
      |> add_to_list(["live_metrics"], live_metric({:service, @not_existing_service_name}, "mem", {34, "kb"}))
      |> with_mdm
      {:error, path, reason} = JmmsrParser.from_file @tmp_file
      assert {reason, path} == {:undefined_service, "live_metrics"}
    end

    test ":undefined_machine is detected when there is a live_metric with machine not being in machines list" do
      correct_jmmsr()
      |> add_to_list(["live_metrics"], live_metric({:machine, @not_existing_machine_id}, "mem", {34, "kb"}))
      |> with_mdm
      {:error, path, reason} = JmmsrParser.from_file @tmp_file
      assert {reason, path} == {:undefined_machine, "live_metrics"}
    end



    ## HELPERS ######

    defp with_mdm(mdm_map) do
      mdm_map
      |> Poison.encode!
      |> write_to_file
    end

    defp write_to_file(string) do
      {:ok, file} = File.open @tmp_file, [:write]
      IO.binwrite file, string
      File.close file
    end

    defp correct_jmmsr do
      %{
        "config" => %{
          "metrics" => ["cpuUsage"],
          "persist" => true,
          "persist_machine" => 34,
          "pilot_machine" => 34
        },
        "connections" => [
          connection("client_http", "server_http"),
          connection("some_service1", "some_service2")
        ],
        "live_metrics" => [
          live_metric({:service, "client_http"}, "cpu", {456, "ms"})
        ],
        "machines" => [
          machine("PC1", 34, "linux", [{"domain", "www.someexampleofdomain.pl"}]),
          machine("PC2", 33, "linux", [{"ip", "178.11.11.1"}])
        ],
        "services" => [
          service("server_http"),
          service("client_http"),
          service("some_service1"),
          service("some_service2")
        ]
      }
    end

    # TODO simplify
    defp update_first(jmmsr, list_path, update_path, nil) do
      list = jmmsr
             |> pop_in(list_path)
             |> elem(0)
      element = list |> Enum.at(0)
      list = list -- [element]
      element = element
                |> pop_in(update_path)
                |> elem(1)
      list = [element | list]

      jmmsr
      |> put_in(list_path, list)
    end
    defp update_first(jmmsr, list_path, update_path, new_val) do
      list = jmmsr
             |> pop_in(list_path)
             |> elem(0)
      element = list |> Enum.at(0)
      list = list -- [element]
      element = element
                |> put_in(update_path, new_val)
      list = [element | list]

      jmmsr
      |> put_in(list_path, list)
    end

    defp add_to_list(jmmsr, list_path, element) do
      list = jmmsr
             |> pop_in(list_path)
             |> elem(0)
      new_list = [element | list]

      jmmsr
      |> put_in(list_path, new_list)
    end




end
