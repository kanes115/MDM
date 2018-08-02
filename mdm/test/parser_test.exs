defmodule ParserTest do
  use ExUnit.Case
  doctest MDM
  alias MDM.JmmsrParser

  @mdm_dir "./test/mdms"
  @tmp_file "/tmp/tmp_file.mdm"

  # TODO clean tmp file

  test "greets the world" do
    assert MDM.hello() == :world
  end

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

    defp mdm_file(file), do: @mdm_dir <> "/" <> file <> ".mdm"

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

    # TODO change file
    test ":should_not_be_specified with wrong key in path is detected when live_metrics -> [machine_id | service_name] are both set" do
      {:error, path, reason} = JmmsrParser.from_file mdm_file("live_metrics_for_machine3")
      assert path == "live_metrics, machine_id"
      assert reason == :should_not_be_specified
    end

    # TODO change file
    test ":type_mismatch is detected when live_metrics -> machine_id is not int" do
      {:error, path, reason} = JmmsrParser.from_file mdm_file("live_metrics_for_machine4")
      assert reason == :type_mismatch
      assert path == "live_metrics, machine_id"
    end

    # Relations

    test ":not_uniqe is detected when there are two the same services" do
      {:error, path, reason} = JmmsrParser.from_file mdm_file("the_same_services")
      assert reason == :not_unique
      assert path == "services"
    end

    test ":undefined_machine is detected when there is a machine specified that is not defined in 'machines' value" do
      {:error, path, reason} = JmmsrParser.from_file mdm_file("undefined_machine_in_services")
      assert reason == :undefined_machine
      assert path == "services"
    end

    test ":not_uniqe is detected when there are two the same machines" do
      {:error, path, reason} = JmmsrParser.from_file mdm_file("the_same_machines")
      assert reason == :not_unique
      assert path == "machines"
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
          %{
            "for_machine" => false,
            "metric" => "cpu",
            "service_name" => "client_http",
            "unit" => "ms",
            "value" => 456
          }
        ],
        "machines" => [
          %{
            "domain" => "www.someexampleofdomain.pl",
            "id" => 34,
            "name" => "PC1",
            "os" => "linux"
          },
          %{"id" => 33, "ip" => "178.11.11.1", "name" => "PC2", "os" => "linux"}
        ],
        "services" => [
          service("server_http"),
          service("client_http"),
          service("some_service1"),
          service("some_service2")
        ]
      }
    end

    defp connection(from, to, port \\ 80) do
        %{
            "port" => port,
            "service_from" => from,
            "service_to" => to
          }
    end

    defp service(name) do
        %{
            "containerized" => true,
            "name" => name,
            "requirements" => %{
              "HDD" => 242,
              "RAM" => 453,
              "available_machines" => [],
              "os" => ["linux"]
            },
            "service_dir" => "/some/path/to/directory",
            "service_executable" => "/some/path/to/file"
          }
    end

    # TODO simplify
    defp update_first(jmmsr, list_path, update_path, nil) do
      list = correct_jmmsr()
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
      list = correct_jmmsr()
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



end