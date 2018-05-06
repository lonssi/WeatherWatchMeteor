#!/bin/bash

cd /app
meteor npm install --unsafe-perm
meteor run --settings settings.json --port=3000 --unsafe-perm
