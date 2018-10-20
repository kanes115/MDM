#!/bin/bash

# $1 - path to service
# $2 - path to logs
COMMAND=$(realpath $1)
setsid $COMMAND > $(realpath $2) 2>&1 < /dev/null &
sleep 1
PID=$(pidof -s $COMMAND)
PGID=$(ps -p $PID -o pgid= | head -n 1 | tr -d '[:space:]')
echo "$PGID"

