#!/bin/bash
#
# Start script for acsp-web

PORT=3000

export NODE_PORT=${PORT}
for entry in /opt/*
do
  echo "$entry"
done

for entry in /opt/assets
do
  echo "$entry"
done

ls -R /opt/assets
exec node /opt/dist/src/main/server.js -- ${PORT}