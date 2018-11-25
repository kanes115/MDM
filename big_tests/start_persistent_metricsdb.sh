docker run --ulimit nofile=66000:66000 \
  -d \
  --name docker-statsd-influxdb-grafana \
  -p 3003:3003 \
  samuelebistoletti/docker-statsd-influxdb-grafana:latest
docker network connect --alias mdmmetricsdb.com big_tests_default docker-statsd-influxdb-grafana
