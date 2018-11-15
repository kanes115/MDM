#function exit_this_thing() {
#    echo "Got sigterm!!!!!!!"
#    echo "Got sigterm!!!!!!!" >> /did_i_get_sigterm
#    exit 101
#}

touch /ola.txt
trap 'echo "ala ma kota" > /ola.txt' SIGTERM
while :; do
    echo "ala"
done

