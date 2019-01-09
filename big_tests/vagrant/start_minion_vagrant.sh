ip=$(/sbin/ifconfig eth1 | grep 'inet addr' | cut -d: -f2 | awk '{print $1}')
cd mdmminion
iex --name minion@$ip --cookie ala -S mix