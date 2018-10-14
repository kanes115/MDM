print_usage(){
    echo "Usage:"
    echo "$0 [rebuild]"
}

if [[ $# == 1 ]] && [[ "$1" == "rebuild" ]]; then
    echo "=============== Rebuilding ==============="
    docker-compose build
    echo "=========================================="
elif (( $# >= 1 )); then
    print_usage
    exit 1
else
    docker-compose down
    docker-compose rm -f
fi
docker-compose up
