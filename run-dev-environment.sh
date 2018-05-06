#!/bin/bash
set -x
set -e

# Check that the settings file exists
if [ ! -f app/settings.json ]; then
    echo "Error: File app/settings.json not found!"
    exit 1
fi

export METEOR_LOCAL=$([ $(uname) == "Darwin" ] && echo "~/.meteor-linux" || echo "~/.meteor")

docker pull ubuntu:16.04

git submodule init && git submodule update

# Cleanup old compose (if exists)
docker-compose down || true

docker build -t weatherwatch-base --file=Dockerfile-base .

docker-compose up
