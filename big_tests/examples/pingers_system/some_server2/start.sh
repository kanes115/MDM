ping -c 2 some_server || true
echo "$?" > /ping.txt
