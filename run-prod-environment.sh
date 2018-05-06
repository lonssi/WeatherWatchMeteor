#!/bin/bash
set -x
set -e

# Check that the settings file exists
if [ ! -f app/settings.json ]; then
    echo "Error: File app/settings.json not found!"
    exit 1
fi

export METEOR_LOCAL=$([ $(uname) == "Darwin" ] && echo "~/.meteor-linux" || echo "~/.meteor")

# Generate docker-compose-production.yml
# Replace ##_METEOR_SETTINGS_## with contents of settings.json and output to docker-compose.yml
set +x
sed -e 's|##_METEOR_SETTINGS_##|'"$(tr -d '\040\011\012\015' < app/settings.json)"'|' \
    "./docker-compose-production.yml.template" > "./docker-compose-production.yml"
set -x

# Cleanup old compose (if exists)
docker-compose --file docker-compose-production.yml down || true

docker build -t weatherwatch-base --file=Dockerfile-base .
docker build -t weatherwatch-production --file=Dockerfile .

docker-compose --file docker-compose-production.yml up
