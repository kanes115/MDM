print_usage(){
    echo "Usage:"
    echo "$0 [minions | pilot | all] [build_opts]"
}

if [[ $# > 0 ]]; then
    echo "=============== Rebuilding ==============="
    build_opts=$2
    services=""
    if [[ $1 == "minions" ]]; then
        services="minion1 minion2 minion3"
    elif [[ $1 == "pilot" ]]; then
        services="pilot"
    elif [[ $1 == "all" ]]; then
        services=""
    else
        print_usage
        exit 1
    fi
    docker-compose build $build_opts $services
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
