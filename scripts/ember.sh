#!/bin/bash
docker-compose run \
  --rm \
  --no-deps \
  --workdir /parcel-plug/services/manage \
  --entrypoint /parcel-plug/node_modules/.bin/ember \
  manage \
  $@
