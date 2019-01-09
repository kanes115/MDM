ip=$(/sbin/ifconfig eth1 | grep 'inet addr' | cut -d: -f2 | awk '{print $1}')
cd mdm
iex --name pilot@pilot.com --cookie ala -S mix