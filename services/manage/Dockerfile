FROM danlynn/ember-cli:3.6.1 as ember
WORKDIR /parcel-plug
COPY package.json yarn.lock /parcel-plug/
COPY ./services/manage /parcel-plug/services/manage/
RUN yarn
WORKDIR /parcel-plug/services/manage
RUN node_modules/.bin/ember build --env=production

FROM nginx:alpine
VOLUME /parcel-plug/services/manage/dist
COPY --from=ember /parcel-plug/services/manage/dist /parcel-plug/services/manage/dist/app

VOLUME /etc/nginx/conf.d
COPY ./services/manage/nginx.conf /etc/nginx/conf.d/manage.conf
