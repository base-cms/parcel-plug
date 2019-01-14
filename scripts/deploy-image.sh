#!/bin/bash
echo "$DOCKER_PASSWORD" | docker login -u "$DOCKER_USERNAME" --password-stdin
docker build -t "parcel-plug:$1" .
docker tag "parcel-plug:$1" "basecms/parcel-plug:$1"
docker push "basecms/parcel-plug:$1"
