
wait_for_postgres() {
    touch ~/log_of_waiting.txt
    res=1
    while [ $res != 0 ]; do
        psql -U ola -h postgres -d postgres -c "select NULL;"
        res=$?
        sleep 1
    done
}


# Download and install mongooseim
wget https://packages.erlang-solutions.com/erlang/mongooseim/FLAVOUR_1_main/mongooseim_3.1.1-1~debian~stretch_amd64.deb
dpkg -i mongooseim_3.1.1-1~debian~stretch_amd64.deb

# copy configuration
cp ./etc/* /etc/mongooseim/

# Initialize the db
apt-get update
apt-get install -y postgresql-client
wait_for_postgres
psql -U ola -d postgres -h postgres -c "CREATE DATABASE mongooseim;"
psql -U ola -d mongooseim -h postgres < ./priv/pg.sql
psql -U ola -d postgres -h postgres -c "ALTER USER ola WITH PASSWORD 'mongooseim';"

# Run mongooseim
mongooseimctl foreground
