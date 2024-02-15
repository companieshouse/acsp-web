#!/bin/bash
#
# Start script for acsp-web

PORT=3000

export NODE_PORT=${PORT}
for entry in /opt/*
do
  echo "$entry"
done
echo "now printing dist---------"
for entry in /opt/dist/*

exec node /opt/dist/src/main/server.js -- ${PORT}
