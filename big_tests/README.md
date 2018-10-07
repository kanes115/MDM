# Tests

All commands must be run in `big_tests/` directory.

To build test images
```
docker-compose build
```
and then to run test containers
```
docker-compose up
```

From outside containers the pilot is available at port 4000 on localhost and minions are visible to him on domains `minion1.com` and `mionon2.com`.
Because of the fact that it is impossible to connect to conatiners from outside docker network on MACos systems, we run tests from another container.

To run tests type:
```
./test_env_start.sh run
```
You can omit `run` argument if you just want to get docker's shell with CWD set to your PWD (and run tests yourself).
Test containers must be already started to run tests.

## Note
We run test nodes with long names so that we're able to use IP that user provided when defining machines in JMMSR.
We keep two nodes: one with node name `minion@<IP>` and one with domain name as IP `minion@minion2.com` (see docker-compose.yml for details).
