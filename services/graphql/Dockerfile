FROM node:10.13
ENV NODE_ENV production
ADD ./ /parcel-plug
WORKDIR /parcel-plug

RUN yarn --production

WORKDIR /parcel-plug/services/graphql
ENTRYPOINT [ "node", "src/index.js" ]
