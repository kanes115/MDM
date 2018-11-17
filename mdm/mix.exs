defmodule MDM.MixProject do
  use Mix.Project

  def project do
    [
      app: :mdm,
      version: "0.1.0",
      elixir: "~> 1.6",
      start_permanent: Mix.env() == :prod,
      deps: deps()
    ]
  end

  # Run "mix help compile.app" to learn about applications.
  def application do
    [
      mod: {MDM.MDMApp, []},
      extra_applications: [:logger, :elixometer]
    ]
  end

  # Run "mix help deps" to learn about dependencies.
  defp deps do
    [
      {:poison, "~> 3.1"},
      {:socket, "~> 0.3"}, # ws used for server side
      {:websockex, "~> 0.4.0"}, # ws client for testing 
      {:distillery, "~> 1.5"},
      #{:elixometer, "~> 1.2"}
      {:setup, "1.8.4", override: true, manager: :rebar},
      {:elixometer, github: "pinterest/elixometer"},
      {:exometer_influxdb, github: "travelping/exometer_influxdb"},
      {:exometer_core, "~> 1.0", override: true},
      {:lager, "3.0.2", override: true},
      {:hackney, "~> 1.4.4", override: true}
    ]
  end
end
