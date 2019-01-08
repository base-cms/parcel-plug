import Route from '@ember/routing/route';
import { RouteQueryManager } from 'ember-apollo-client';
import ApplicationRouteMixin from 'ember-simple-auth/mixins/application-route-mixin';

import query from '@base-cms/parcel-plug-manage/gql/ping';

export default Route.extend(ApplicationRouteMixin, RouteQueryManager, {
  model() {
    return this.get('apollo').watchQuery({ query });
  },
});
