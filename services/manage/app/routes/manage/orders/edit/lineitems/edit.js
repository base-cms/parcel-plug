import Route from '@ember/routing/route';
import { RouteQueryManager } from 'ember-apollo-client';

import query from '@base-cms/parcel-plug-manage/gql/queries/lineitem/edit';

export default Route.extend(RouteQueryManager, {
  model({ lineitem_id }) {
    const variables = { input: { id: lineitem_id } };
    return this.get('apollo').watchQuery({ query, variables, fetchPolicy: 'network-only' }, 'lineitem');
  },
});

