# Tests

To build test images
```
docker-compose build
```

and then to run test containers
```
docker-compose up
```

The pilot is available at port 4000 on localhost and minions are visible to him on domains `minion1` and `mionon2` (for further details see `example_ws_request_simple` file and machines' definitions).

## Note
We run test nodes with snames but on production it is better to use long names.
