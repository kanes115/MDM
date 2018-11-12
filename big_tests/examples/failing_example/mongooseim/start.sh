wget https://packages.erlang-solutions.com/erlang/mongooseim/FLAVOUR_1_main/mongooseim_3.1.1-1~debian~stretch_amd64.deb

apt-get update
apt-get install sudo -y

dpkg -i mongooseim_3.1.1-1~debian~stretch_amd64.deb

echo "Starting mongooseim"
mongooseimctl live
echo "Stopping mongooseim"
