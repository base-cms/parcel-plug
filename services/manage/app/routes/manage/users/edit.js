import Route from '@ember/routing/route';
import { RouteQueryManager } from 'ember-apollo-client';

import query from '@base-cms/parcel-plug-manage/gql/queries/user/edit';

export default Route.extend(RouteQueryManager, {
  model({ id }) {
    const variables = { input: { id } };
    return this.get('apollo').watchQuery({ query, variables, fetchPolicy: 'network-only' }, 'user');
  },
});

