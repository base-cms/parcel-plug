#!/bin/bash
set -e
./scripts/deploy-notify-start.sh
yarn global add @base-cms/travis-rancher-deployer

deploy-to-rancher "nginx:alpine" manage-nginx
deploy-to-rancher "basecms/parcel-plug:${TRAVIS_TAG}" manage
deploy-to-rancher "basecms/parcel-plug:${TRAVIS_TAG}" graphql
deploy-to-rancher "basecms/parcel-plug:${TRAVIS_TAG}" delivery
deploy-to-rancher "basecms/parcel-plug:${TRAVIS_TAG}" event-processor

./scripts/deploy-notify.sh
