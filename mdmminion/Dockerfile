FROM elixir:latest

RUN mkdir /app
COPY ./ /app
WORKDIR /app

RUN apt-get update && apt-get install -y \
    util-linux

RUN mix local.hex --force

RUN mix do compile

ARG DOMAIN
ENV DOMAIN=${DOMAIN}
CMD iex --sname minion@${DOMAIN} --cookie ala -S mix
