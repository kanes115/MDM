defmodule ParserTest do
  use ExUnit.Case
  doctest MDM
  alias MDM.JmmsrParser
  alias MDM.JmmsrParser.Utils

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
    assert path == "config, persist"
    assert reason == :type_mismatch
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
    IO.inspect reason
    assert path == "config, metrics"
    assert reason == :unknown_metric
  end





  defp mdm_file(file), do: @mdm_dir <> "/" <> file <> ".mdm"

end
