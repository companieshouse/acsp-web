#!/bin/bash
#
# Start script for acsp-web

PORT=3000

export NODE_PORT=${PORT}
for entry in /opt/*
do
  echo "$entry"
done
echo "now printing src---------"
for entry in /opt/dist/src/*
do
  echo "$entry"
done
exec node /opt/dist/src/main/server.js -- ${PORT}
