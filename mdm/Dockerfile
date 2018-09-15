# Use an official Elixir runtime as a parent image
FROM elixir:latest

# Create app directory and copy the Elixir projects into it
RUN mkdir /app
COPY ./ /app
WORKDIR /app

RUN mix local.hex --force

RUN mix do compile

ARG DOMAIN
ENV DOMAIN=${DOMAIN}
CMD iex --sname pilot@${DOMAIN} --cookie ala -S mix
