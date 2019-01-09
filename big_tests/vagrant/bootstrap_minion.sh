#!/usr/bin/env bash

apt-get update && apt-get install -y \
    util-linux \
    python3 \
    ifstat \
    nethogs \
    git \
    g++ \
    vim \
    net-tools \
    psmisc \
    dnsutils \
    telnet \
    net-tools \
    vim

wget https://packages.erlang-solutions.com/erlang-solutions_1.0_all.deb && sudo dpkg -i erlang-solutions_1.0_all.deb
sudo apt-get update
sudo apt-get install -y esl-erlang
sudo apt-get install -y elixir

cd /home/vagrant/mdmminion

mix local.hex --force

mix local.rebar --force

mix do compile