
wait_for_mim1() {
    res=1
    while [ $res != 0 ]; do
        curl -k https://mongooseim-1:8089/api/
        res=$?
        sleep 1
    done
}


# Download and install mongooseim
wget https://packages.erlang-solutions.com/erlang/mongooseim/FLAVOUR_1_main/mongooseim_3.1.1-1~debian~stretch_amd64.deb
dpkg -i mongooseim_3.1.1-1~debian~stretch_amd64.deb

# copy configuration
cp ./etc/* /etc/mongooseim/

# Run and cluster mongooseim
mongooseimctl start
mongooseimctl started
mongooseimctl join_cluster -f mongooseim@mongooseim-1
mongooseimctl stop
mongooseimctl foreground
