defmodule ParserUtilsTest do
  use ExUnit.Case
  doctest MDM

  alias MDM.JmmsrParser.Utils

  test "greets the world" do
    assert MDM.hello() == :world
  end

  ## Path tests

  test "Utils.path/2 returns value under given path" do
    value = "kota"
    json = %{"ala" => %{"ma" => value}}
    assert value == json |> Utils.path(["ala", "ma"])
  end

  test "Utils.path/2 returns :not_found when path does not exist" do
    json = %{"ala" => %{"ma" => %{"psa" => "?"}}}
    assert :not_found == json |> Utils.path(["ala", "ma", "kota"])
  end

  test "Utils.path/2 branches out on lists" do
    json = %{"ala" => [
                        %{"kot" => "kotek"},
                        %{"kot" => "piesek"}
                      ]
            }
    assert ["kotek", "piesek"] == json |> Utils.path(["ala", "kot"])
  end

  test "Utils.path/2 returns :not_found on element of the list 
        that does not contain key from path" do
    json = %{"ala" => [
                        %{"kot" => "kotek"},
                        %{"pies" => "piesek"}
                      ]
            }
    assert ["kotek", :not_found] == json |> Utils.path(["ala", "kot"])
  end

  test "Utils.path/2 branches further returning nested lists" do
    json = %{"ala" => [
                        %{"kot" => [%{"kotek" => "kotus"}]},
                        %{"kot" => [%{"kotek" => "kotus"}]}
                      ]
            }
    assert [["kotus"], ["kotus"]] == json |> Utils.path(["ala", "kot", "kotek"])
  end

  test "Utils.path/2 branches further returning nested lists and can conatin :not_found" do
    json = %{"ala" => [
                        %{"kot" => [%{"sth_else" => "kotus"}]},
                        %{"kot" => [%{"kotek" => "kotus"}]}
                      ]
            }
    assert [[:not_found], ["kotus"]] == json |> Utils.path(["ala", "kot", "kotek"])
  end

  test "Utils.path/2 branches further returning :not_found on different levels" do
    json = %{"ala" => [
                        %{"sth_else" => "none"},
                        %{"kot" => [%{"kotek" => "kotus"}]}
                      ]
            }
    assert [:not_found, ["kotus"]] == json |> Utils.path(["ala", "kot", "kotek"])
  end

  ## check_test test
  
  test "Utils.check_values/3 returns true if every value fulfills predicate" do
    json = %{"ala" => [
                        %{"kot" => "a"},
                        %{"kot" => "b"}
                      ]
            }
    assert true == Utils.check_values(json, ["ala", "kot"], &is_bitstring/1)
  end

  test "Utils.check_values/3 returns {false, path, reason = :predicate} if any value 
        does not fulfill predicate" do
    path = ["ala", "kot"]
    json = %{"ala" => [
                        %{"kot" => 56},
                        %{"kot" => "b"}
                      ]
            }
    assert {false, path, :predicate} == Utils.check_values(json, path, &is_bitstring/1)
  end

  test "Utils.check_values/3 returns {false, path, reason = :not_found} 
        if there is an element in list without a key specified in path" do
    path = ["ala", "kot"]
    json = %{"ala" => [
                        %{"kotek" => "a"},
                        %{"kot" => "b"}
                      ]
            }
    assert {false, path, :not_found} == Utils.check_values(json, path, &is_bitstring/1)
  end

  test "Utils.check_values/3: :not_found has higher precedence" do
    path = ["ala", "kot"]
    json = %{"ala" => [
                        %{"kotek" => "a"},
                        %{"kot" => 44}
                      ]
            }
    assert {false, path, :not_found} == Utils.check_values(json, path, &is_bitstring/1)
  end

  test "Utils.check_values/4: returns true if must_be_defined? set to false despite 
        the fact that leaf key does not exist" do
    path = ["ala", "kot"]
    json = %{"ala" => [
                        %{"kotek" => "a"},
                        %{"kot" => "a"}
                      ]
            }
    assert true == Utils.check_values(json, path, &is_bitstring/1, false)
  end

  test "Utils.check_values/4: returns true if must_be_defined? set to false despite 
        the fact that key in the middle ldoes not exist" do
    path = ["ala", "kot"]
    json = %{"not_ala" => [
                        %{"kot" => "a"},
                        %{"kot" => "a"}
                      ]
            }
    assert true == Utils.check_values(json, path, &is_bitstring/1, false)
  end

end
