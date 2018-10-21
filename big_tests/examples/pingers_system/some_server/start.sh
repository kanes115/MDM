ping -c 2 some_server2 || true
echo "$?" > /ping.txt
