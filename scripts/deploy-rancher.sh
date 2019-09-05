#!/bin/bash
set -e
IMAGE=basecms/parcel-plug-$1:$2
yarn global add @base-cms/travis-rancher-deployer
deploy-to-rancher $IMAGE "parcel-plug-$1"

payload="{
  \"deployment\": {
    \"revision\": \"\`$2\`\",
    \"user\": \"TravisCD\"
  }
}"
curl -f -X POST --data "$payload" \
  -H 'Content-type: application/json' \
  -H "X-Api-Key:$NR_APIKEY" \
  https://api.newrelic.com/v2/applications/$3/deployments.json
