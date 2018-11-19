# This file is responsible for configuring your application
# and its dependencies with the aid of the Mix.Config module.
use Mix.Config

# This configuration is loaded before any dependency and is restricted
# to this project. If another project depends on this project, this
# file won't be loaded nor affect the parent project. For this reason,
# if you want to provide default values for your application for
# 3rd-party users, it should be done in your "mix.exs" file.

# You can configure your application as:
#
#     config :mdm, key: :value
#
# and access this configuration in your application as:
#
#     Application.get_env(:mdm, :key)
#
# You can also configure a 3rd-party app:
#
#     config :logger, level: :info
#

# It is also possible to import configuration files, relative to this
# directory. For example, you can emulate configuration per environment
# by uncommenting the line below and defining dev.exs, test.exs and such.
# Configuration from the imported file will override the ones defined
# here (which is why it is important to import them last).
#
#     import_config "#{Mix.env}.exs"

config :mdm,
  deploy_decider: MDM.DeployDeciderSimple,
  live_metrics_report_interval: 2000 #ms

config :elixometer, reporter: :exometer_report_influxdb,
  update_frequency: 5_000,
  env: "prod",
  metric_prefix: "mdm"

config :exometer_core, report: [
  reporters: [
    exometer_report_influxdb: [
      protocol: :http,
      host: "mdmmetricsdb.com",
      port: 8086,
      db: "telegraf"
    ]
  ]
]
