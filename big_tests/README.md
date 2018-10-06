# Tests

To build test images
```
docker-compose build
```

and then to run test containers
```
docker-compose up
```

The pilot is available at port 4000 on localhost and minions are visible to him on domains `minion1.com` and `mionon2.com` (for further details see `example_ws_request_simple` file and machines' definitions).

## Note
We run test nodes with long names so that we're able to use IP that user provided when defining machines in JMMSR.
We keep two nodes: one with node name `minion@<IP>` and one with domain name as IP `minion@minion2.com` (see docker-compose.yml for details).
