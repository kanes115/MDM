if [ -z "${DOMAIN}" ]
then
    # if domain was not set, we use ip
    LONG_NAME=$(hostname -i) # Debian specific
    echo "Long name is $LONG_NAME"
    iex --name minion@${LONG_NAME} --cookie ala -S mix
else
    echo "Long name is $DOMAIN"
    iex --name minion@${DOMAIN} --cookie ala -S mix
fi
