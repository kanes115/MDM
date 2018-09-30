defmodule MDM.CommonTypes do
  @type os :: :debian | :linux
  @type unit() :: :kb | :mhz
  @type single_resource() :: {float(), unit()}
  @type path() :: String.t
end
