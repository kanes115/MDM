defmodule ParserTest do
  use ExUnit.Case
  doctest MDM
  alias MDM.JmmsrParser

  @mdm_dir "./test/mdms"

  test "greets the world" do
    assert MDM.hello() == :world
  end

  test "Correct jmmsr is parsed without error" do
    {:ok, json} = JmmsrParser.from_file mdm_file("full_correct")
    assert is_map(json)
  end


  ## Config tests

  test "Type mismatch is detected at config, persist" do
    {:error, path, reason} = JmmsrParser.from_file mdm_file("wrong_type_config_persist")
    assert reason == :type_mismatch
    assert path == "config, persist"
  end

  test "Type mismatch is detected at config_perists_machine" do
    {:error, path, reason} = JmmsrParser.from_file mdm_file("wrong_type_config_persist_machine")
    assert path == "config, persist_machine"
    assert reason == :type_mismatch
  end

  test "Not-found detected when config, pilot_machine is missing" do
    {:error, path, reason} = JmmsrParser.from_file mdm_file("pilot_machine_missing")
    assert path == "config, pilot_machine"
    assert reason == :not_found
  end

  test "If persist specified persist_machine need not be" do
    {:ok, json} = JmmsrParser.from_file mdm_file("persist_false_no_persist_machine")
    assert is_map(json)
  end

  # TODO capture warning
  test "If persist specified persist_machine can still be" do
    {:ok, json} = JmmsrParser.from_file mdm_file("persist_false_persist_machine_specified")
    assert is_map(json)
  end

  test "If there's unknown metric in config, metrics we give error" do
    {:error, path, reason} = JmmsrParser.from_file mdm_file("config_unknown_metric")
    assert path == "config, metrics"
    assert reason == :unknown_metric
  end

  test "No config" do
    {:error, path, reason} = JmmsrParser.from_file mdm_file("no_config")
    assert path == "config"
    assert reason == :not_found
  end


  # Machines
  
    test "Type mismatch is detected when machines name is int" do
      {:error, path, reason} = JmmsrParser.from_file mdm_file("machines_name_type")
      assert path == "machines, name"
      assert reason == :type_mismatch
    end
  
    test "Type mismatch is detected when machines id is bool" do
      {:error, path, reason} = JmmsrParser.from_file mdm_file("machines_id_type")
      assert path == "machines, id"
      assert reason == :type_mismatch
    end
  
    test ":no_address is detected when neither IP nor domain is specified" do
      {:error, path, reason} = JmmsrParser.from_file mdm_file("machines_no_address")
      assert path == "machines"
      assert reason == :no_address
    end
  
    test ":unknown_os is detected when os is not one of linux or debian" do
      {:error, path, reason} = JmmsrParser.from_file mdm_file("machines_unknown_os")
      assert path == "machines, os"
      assert reason == :unknown_os
    end
  
    test ":two_addresses is detected when both IP and domain is specified" do
      {:error, path, reason} = JmmsrParser.from_file mdm_file("machines_two_addresses")
      assert path == "machines"
      assert reason == :two_addresses
    end
  
    test ":not_found is detected when there is no machines" do
      {:error, path, reason} = JmmsrParser.from_file mdm_file("machines_no_machines")
      assert path == "machines"
      assert reason == :not_found
    end

    defp mdm_file(file), do: @mdm_dir <> "/" <> file <> ".mdm"

    # Services 
    
    test "Type mismatch is detected when service name is bool" do
      {:error, path, reason} = JmmsrParser.from_file mdm_file("service_name_type")
      assert path == "services, name"
      assert reason == :type_mismatch
    end

    test "Type mismatch is detected when containerized is string" do
      {:error, path, reason} = JmmsrParser.from_file mdm_file("service_containerized")
      assert path == "services, containerized"
      assert reason == :type_mismatch
    end

    test "Type mismatch is detected when requirements is list" do
      {:error, path, reason} = JmmsrParser.from_file mdm_file("service_requirements")
      assert path == "services, requirements"
      assert reason == :type_mismatch
    end

    test ":unknown_os is detected when requirements -> os is not one of known oses" do
      {:error, path, reason} = JmmsrParser.from_file mdm_file("service_unknown_os")
      assert path == "services, requirements, os"
      assert reason == :unknown_os
    end

    test ":type_mismatch is detected when requirements -> HDD is a string" do
      {:error, path, reason} = JmmsrParser.from_file mdm_file("service_requirements_hdd")
      assert path == "services, requirements, HDD"
      assert reason == :type_mismatch
    end

    test ":type_mismatch is detected when requirements -> available_machines is not a list of ints" do
      {:error, path, reason} = JmmsrParser.from_file mdm_file("service_available_machines_not_list")
      {:error, ^path, ^reason} = JmmsrParser.from_file mdm_file("service_available_machines_list_strings")
      assert path == "services, requirements, available_machines"
      assert reason == :type_mismatch
    end

    test "No requirement is compulsory, the key can be ommited then" do
      {:ok, _json} = JmmsrParser.from_file mdm_file("service_requirements_no_oses")
      {:ok, _json} = JmmsrParser.from_file mdm_file("service_requirements_no_hdd")
      {:ok, _json} = JmmsrParser.from_file mdm_file("service_requirements_empty")
    end

    # Connection parser

    test ":type_mismatch is detected when connections -> service_from is not a string" do
      {:error, path, reason} = JmmsrParser.from_file mdm_file("connection_service_from_int")
      assert path == "connections, service_from"
      assert reason == :type_mismatch
    end

    test ":type_mismatch is detected when connections -> port is bigger than 65000" do
      {:error, path, reason} = JmmsrParser.from_file mdm_file("connection_big_port")
      assert path == "connections, port"
      assert reason == :invalid_port
    end


    # Live metrics parser
    
    test ":not_found is detected when live_metrics -> for_machine set to true but machine_id not set" do
      {:error, path, reason} = JmmsrParser.from_file mdm_file("live_metrics_for_machine")
      assert path == "live_metrics, machine_id"
      assert reason == :not_found
    end

    test ":not_found is detected when live_metrics -> for_machine set to false but service_name not set" do
      {:error, path, reason} = JmmsrParser.from_file mdm_file("live_metrics_for_machine2")
      assert path == "live_metrics, service_name"
      assert reason == :not_found
    end

    test ":should_not_be_specified with wrong key in path is detected when live_metrics -> [machine_id | service_name] are both set" do
      {:error, path, reason} = JmmsrParser.from_file mdm_file("live_metrics_for_machine3")
      assert path == "live_metrics, machine_id"
      assert reason == :should_not_be_specified
    end

    test ":type_mismatch is detected when live_metrics -> machine_id is not int" do
      {:error, path, reason} = JmmsrParser.from_file mdm_file("live_metrics_for_machine4")
      assert reason == :type_mismatch
      assert path == "live_metrics, machine_id"
    end

end
