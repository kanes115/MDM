export DEBIAN_FRONTEND="noninteractive"
set -x
useradd -m ola
echo "ola	ALL=(ALL:ALL) ALL" >> /etc/sudoers
apt-get update
apt-get install -y postgresql-9.6 postgresql-client-9.6
runuser -l ola -c "rm -rf db_dir"
runuser -l ola -c "mkdir -p db_dir"
runuser -l ola -c "sudo chown ala db_dir"
chown -R ola:ola /var/run/postgresql && echo \"ok chown\"
runuser -l ola -c "sudo chmod 700 db_dir"
runuser -l ola -c "/usr/lib/postgresql/9.6/bin/initdb db_dir/"

# Configure postgres
cp ./postgresql.conf /home/ola/db_dir/
cp ./pg_hba.conf /home/ola/db_dir/

runuser -l ola -c "/usr/lib/postgresql/9.6/bin/postgres -D db_dir/"
