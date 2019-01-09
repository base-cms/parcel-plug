import Mixin from '@ember/object/mixin';
import RouteObservableMixin from '@base-cms/parcel-plug-manage/mixins/route-observable-mixin';

export default Mixin.create(RouteObservableMixin, {
  queryParams: {
    limit: {
      refreshModel: true
    },
    field: {
      refreshModel: true
    },
    order: {
      refreshModel: true
    },
  },

  /**
   *
   * @param {object} params
   */
  async getResults({ query, queryKey, queryInput }, { first, field, order }) {
    const pagination = { first };
    const sort = { field, order };
    const input = { pagination, sort, ...queryInput }
    const variables = { input };

    this.getController().set('resultKey', queryKey);
    try {
      const response = await this.get('apollo').watchQuery({ query, variables, fetchPolicy: 'network-only' }, queryKey);
      this.getController().set('observable', this.getObservable(response));
      return response;
    } catch (e) {
      this.get('graphErrors').show(e);
    }
  },
});
