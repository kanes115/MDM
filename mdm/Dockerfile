FROM elixir:latest

RUN mkdir /app
COPY ./ /app
WORKDIR /app

RUN mix local.hex --force

RUN mix do compile

ARG DOMAIN
ENV DOMAIN=${DOMAIN}
CMD iex --sname pilot@${DOMAIN} --cookie ala -S mix
