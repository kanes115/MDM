defmodule MDMTest do
  use ExUnit.Case
  doctest MDM

  test "greets the world" do
    assert MDM.hello() == :world
  end
end
