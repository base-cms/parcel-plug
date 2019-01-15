import Route from '@ember/routing/route';
import { RouteQueryManager } from 'ember-apollo-client';

import query from '@base-cms/parcel-plug-manage/gql/queries/ad/edit';

export default Route.extend(RouteQueryManager, {
  model({ ad_id }) {
    const variables = { input: { id: ad_id } };
    return this.get('apollo').watchQuery({ query, variables, fetchPolicy: 'network-only' }, 'ad');
  },
});

