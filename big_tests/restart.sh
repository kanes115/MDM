print_usage(){
    echo "Usage:"
    echo "$0 [rebuild]"
}

if [[ $# == 1 ]] && [[ "$1" == "rebuild" ]]; then
    echo "=============== Rebuilding ==============="
    docker-compose build
    if [[ $? != 0 ]]; then
        echo "Build failed!"
        exit 1;
    fi
    echo "=========================================="
elif (( $# >= 1 )); then
    print_usage
    exit 1
fi
docker-compose down
docker-compose rm -f
docker-compose up
