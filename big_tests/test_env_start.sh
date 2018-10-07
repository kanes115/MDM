if [[ "$(docker images -q mdm_test_env:latest 2> /dev/null)" == "" ]]; then
    echo "Image not found. Building..."
    docker build -t mdm_test_env:latest - < Dockerfile.test
fi

docker network inspect big_tests_default >> /dev/null
if [ $? != 0 ]; then
    echo "Network big_tests_default not found. Test containers are probably
          not running. Start them with docker-compose up."
    exit 1
fi

if [[ $# > 0 && $1 == "run" ]]; then
    docker run --network big_tests_default \
        -it --rm --name mdm_test_runner \
        -v $PWD/..:/mdm \
        -w  /mdm/mdm mdm_test_env:latest \
        iex --name test@test.com -S mix test
else
    docker run --network big_tests_default --name mdm_test_runner --rm -it -v $PWD/..:/mdm -w  /mdm mdm_test_env:latest
fi
