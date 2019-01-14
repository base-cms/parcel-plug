FROM danlynn/ember-cli:3.6.1 as ember
ADD ./ /parcel-plug
WORKDIR /parcel-plug
RUN yarn
WORKDIR /parcel-plug/services/manage
VOLUME /parcel-plug/services/manage/tmp
RUN node_modules/.bin/ember build --env=production

FROM node:10.13
ENV NODE_ENV production
WORKDIR /parcel-plug
ADD ./ /parcel-plug
COPY --from=ember /parcel-plug/services/manage/dist /parcel-plug/services/manage/dist
WORKDIR /parcel-plug
VOLUME /parcel-plug/node_modules
RUN yarn --production
