import Route from '@ember/routing/route';
import { RouteQueryManager, getObservable } from 'ember-apollo-client';

import query from '@base-cms/parcel-plug-manage/gql/queries/advertiser/list';
// import search from 'fortnight/gql/queries/advertiser/search';

export default Route.extend(RouteQueryManager, {
  queryParams: {
    limit: {
      refreshModel: true
    },
    after: {
      refreshModel: true
    },
    sortBy: {
      refreshModel: true
    },
    ascending: {
      refreshModel: true
    },
  },

  // search(phrase, pagination) {
  //   const controller = this.controllerFor(this.get('routeName'));
  //   const variables = { pagination, phrase };
  //   const resultKey = 'searchAdvertisers';
  //   controller.set('resultKey', resultKey);
  //   return this.get('apollo').watchQuery({ query: search, variables, fetchPolicy: 'network-only' }, resultKey)
  //     .then((result) => {
  //       controller.set('observable', getObservable(result));
  //       return result;
  //     }).catch(e => this.get('graphErrors').show(e))
  //   ;
  // },

  // model({ first, after, sortBy, ascending, phrase }) {
  //   const controller = this.controllerFor(this.get('routeName'));
  //   const pagination = { first, after };

  //   if (phrase) {
  //     return this.search(phrase, pagination);
  //   }
  //   const sort = { field: sortBy, order: ascending ? 1 : -1 };
  //   const variables = { pagination, sort };
  //   if (!sortBy) delete variables.sort.field;
  //   const resultKey = 'allAdvertisers';
  //   controller.set('resultKey', resultKey);
  //   return this.get('apollo').watchQuery({ query, variables, fetchPolicy: 'network-only' }, resultKey)
  //     .then((result) => {
  //       controller.set('observable', getObservable(result));
  //       return result;
  //     }).catch(e => this.get('graphErrors').show(e))
  //   ;
  // },

  async model() {
    const controller = this.controllerFor(this.get('routeName'));
    const resultKey = 'advertisers';
    controller.set('resultKey', resultKey);
    try {
      const result = await this.get('apollo').watchQuery({ query, fetchPolicy: 'network-only' }, resultKey);
      controller.set('observable', getObservable(result));
      return result;
    } catch (e) {
      this.get('graphErrors').show(e);
    }
  },
});


