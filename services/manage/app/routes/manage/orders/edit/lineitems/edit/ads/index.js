import Route from '@ember/routing/route';
import RouteObservableMixin from '@base-cms/parcel-plug-manage/mixins/route-observable-mixin';

import query from '@base-cms/parcel-plug-manage/gql/queries/ad/list-for-lineitem';
// import search from '@base-cms/parcel-plug-manage/gql/queries/ad/match-for-lineitem';

export default Route.extend(RouteObservableMixin, {
  /**
   *
   * @param {object} params
   */
  async model() {
    const pagination = { limit: 50 };
    const input = {
      lineitemId: this.modelFor('manage.orders.edit.lineitems.edit').id,
      pagination,
    };
    const variables = { input };
    const queryKey = 'adsForLineItem';
    this.getController().set('resultKey', queryKey);
    try {
      const response = await this.get('apollo').watchQuery({ query, variables, fetchPolicy: 'network-only' }, queryKey);
      this.getController().set('observable', this.getObservable(response));
      return response;
    } catch (e) {
      this.get('graphErrors').show(e);
    }
  },
  // model({ limit, field, order, phrase, searchType, searchBy }) {
  //   const input = {
  //     lineitemId: this.modelFor('manage.orders.edit.lineitems.edit').id,
  //   };
  //   return this.getResults({
  //     query,
  //     queryKey: 'adsForLineItem',
  //     queryInput: input,
  //     search,
  //     searchKey: 'matchAdsForLineItem',
  //     searchInput: input,
  //   }, { limit, field, order, phrase, searchType, searchBy });
  // },
});


