ping -c 5 server2

gcc forker.c -o forker
echo "result of compilation is: $?"
./forker
