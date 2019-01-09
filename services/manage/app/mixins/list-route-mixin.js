import Mixin from '@ember/object/mixin';
import RouteSearchMixin from '@base-cms/parcel-plug-manage/mixins/route-search-mixin';

export default Mixin.create(RouteSearchMixin, {
  queryParams: {
    phrase: {
      refreshModel: true,
    },
    searchType: {
      refreshModel: true,
    },
    searchBy: {
      refreshModel: true,
    },
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
  async getResults({
    query,
    queryKey,
    queryInput,
    search,
    searchKey,
    searchInput,
  }, {
    limit,
    field,
    order,
    phrase,
    searchType,
    searchBy,
  }) {
    const pagination = { limit };
    if (phrase) {
      return this.search({
        query: search,
        resultKey: searchKey,
        queryInput: searchInput,
      }, {
        searchBy,
        phrase,
        searchType,
        pagination,
      });
    }

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
