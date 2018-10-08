while [ 1 ]
do
    curl minion1:8888 >> data.txt
    sleep 5
done
