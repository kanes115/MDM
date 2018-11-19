defmodule MDM.Dashboard do
  #TODO move metrics to more appropriate place? Or not?
  @metrics ["cpu", "mem", "net_in", "net_out"]
  @default_formatter Elixometer.Utils

  require Logger

  alias MDM.PersistentMetrics

  def new(jmmsr, title) do
    :ets.new(:coords, [:set, :protected, :named_table])
    :ets.new(:ids, [:set, :protected, :named_table])
    :ets.insert(:coords, {:last, %{x: 0, y: 0, h: 9, w: 12}})
    :ets.insert(:ids, {:last, 1})

    machines_panels(jmmsr) ++ services_panels(jmmsr)
    |> json(title)

  end

  defp machines_panels(jmmsr) do
    formatter = get_formatter()
    @metrics
    |> Enum.map(fn metric_n ->
      jmmsr
      |> MDM.Jmmsr.get_machines()
      |> Enum.map(fn %MDM.Machine{name: machine_n} ->
        {type, metric} = PersistentMetrics.Commons.create_machine_metric(machine_n, metric_n)
        formatter.format(type, metric) |> strange_metric_concat()
      end)
      |> panel("Graph of #{metric_n} for machines", "")
    end)
  end

  defp services_panels(jmmsr) do
    formatter = get_formatter()
    @metrics
    |> Enum.map(fn metric_n ->
      jmmsr
      |> MDM.Jmmsr.get_services()
      |> Enum.map(fn %MDM.Service{name: service_n} ->
        {type, metric} = PersistentMetrics.Commons.create_service_metric(service_n, metric_n)
        formatter.format(type, metric) |> strange_metric_concat()
      end)
      |> panel("Graph of #{metric_n} for services", "")
    end)
  end


  def upload(dashboard) do
    host = get_grafana_host()
    user_pass = get_user_pass()
    body = Poison.encode!(dashboard)
    content_type = 'application/json'
    Application.ensure_all_started(:inets)
    Logger.info "Sending rquest with header: 'Basic #{Base.encode64(user_pass)}'"
    {:ok, {{'HTTP/1.1', 200, 'OK'}, _headers, _body}} =
      :httpc.request(:post, {'http://#{host}/api/dashboards/db', [{'Authorization', 'Basic #{Base.encode64(user_pass)}'}], content_type, body}, [], [])
  end

  # TODO make it configurable
  defp get_grafana_host, do: 'mdmmetricsdb.com:3003'

  defp get_user_pass, do: "root:root"

  defp strange_metric_concat(metric_parts) when is_list(metric_parts) do
    # TODO it is strange because somehow elixometer concatenates those parts
    # with underscores......
    Enum.join(metric_parts, "_")
  end

  defp get_formatter do
    config = Application.get_env(:elixometer, Elixometer.Updater, [])
    Keyword.get(config, :formatter, @default_formatter)
  end

  defp coord_to_json(%{x: x, y: y, w: w, h: h}) do
    %{
      "h": h,
      "w": w,
      "x": x,
      "y": y
    }
  end

  defp next_coord(%{x: 0, y: y, w: w, h: h}), do: %{x: 12, y: y, w: w, h: h}
  defp next_coord(%{x: 12, y: y, w: w, h: h}), do: %{x: 0, y: y + 9, w: w, h: h}

  defp panel(metrics, title, desc, datasource \\ "InfluxDB") do
    targets = metrics |> Enum.map(&target/1)
    [{:last, coord}] = :ets.lookup(:coords, :last)
    :ets.insert(:coords, {:last, coord |> next_coord()})
    [{:last, last_id}] = :ets.lookup(:ids, :last)
    :ets.insert(:ids, {:last, last_id + 1})
    %{
      "aliasColors": %{},
      "bars": false,
      "dashLength": 10,
      "dashes": false,
      "datasource": datasource,
      "description": desc,
      "fill": 1,
      "gridPos": coord_to_json(coord),
      "id": last_id,
      "legend": %{
        "avg": false,
        "current": false,
        "max": false,
        "min": false,
        "show": true,
        "total": false,
        "values": false
      },
      "lines": true,
      "linewidth": 1,
      "links": [],
      "nilPointMode": "nil",
      "percentage": false,
      "pointradius": 5,
      "points": false,
      "renderer": "flot",
      "seriesOverrides": [],
      "spaceLength": 10,
      "stack": false,
      "steppedLine": false,
      "targets": targets,
      "thresholds": [],
      "timeFrom": nil,
      "timeShift": nil,
      "title": title,
      "tooltip": %{
        "shared": true,
        "sort": 0,
        "value_type": "individual"
      },
      "type": "graph",
      "xaxis": %{
        "buckets": nil,
        "mode": "time",
        "name": nil,
        "show": true,
        "values": []
      },
      "yaxes": [
        %{
          "format": "short",
          "label": nil,
          "logBase": 1,
          "max": nil,
          "min": nil,
          "show": true
        },
        %{
          "format": "short",
          "label": nil,
          "logBase": 1,
          "max": nil,
          "min": nil,
          "show": true
        }
      ],
      "yaxis": %{
        "align": false,
        "alignLevel": nil
      }
    }
  end

  defp target(metric) do
    %{
      "groupBy": [],
      "measurement": metric,
      "orderByTime": "ASC",
      "policy": "default",
      "refId": "A",
      "resultFormat": "time_series",
      "select": [
        [
          %{
            "params": [
              "value"
            ],
            "type": "field"
          }
        ]
      ],
      "tags": []
    }
  end

  # The whole JSON to send
  def json(panels, title) do
    %{
      "dashboard":
      %{
        "__inputs": [
          %{
            "name": "DS_INFLUXDB",
            "label": "InfluxDB",
            "description": "",
            "type": "datasource",
            "pluginId": "influxdb",
            "pluginName": "InfluxDB"
          }
        ],
        "__requires": [
          %{
            "type": "grafana",
            "id": "grafana",
            "name": "Grafana",
            "version": "5.3.2"
          },
          %{
            "type": "panel",
            "id": "graph",
            "name": "Graph",
            "version": "5.0.0"
          },
          %{
            "type": "datasource",
            "id": "influxdb",
            "name": "InfluxDB",
            "version": "5.0.0"
          }
        ],
        "annotations": %{
          "list": [
            %{
              "builtIn": 1,
              "datasource": "-- Grafana --",
              "enable": true,
              "hide": true,
              "iconColor": "rgba(0, 211, 255, 1)",
              "name": "Annotations & Alerts",
              "type": "dashboard"
            }
          ]
        },
        "editable": true,
        "gnetId": nil,
        "graphTooltip": 0,
        "id": nil,
        "links": [],
        "panels": panels,
        "schemaVersion": 16,
        "style": "dark",
        "tags": [],
        "templating": %{
          "list": []
        },
        "time": %{
          "from": "now-5m",
          "to": "now"
        },
        "timepicker": %{
          "refresh_intervals": [
            "5s",
            "10s",
            "30s",
            "1m",
            "5m",
            "15m",
            "30m",
            "1h",
            "2h",
            "1d"
          ],
          "time_options": [
            "5m",
            "15m",
            "1h",
            "6h",
            "12h",
            "24h",
            "2d",
            "7d",
            "30d"
          ]
        },
        "timezone": "",
        "title": title,
        "uid": nil,
        "version": 1
      }
    }
  end

end
