import Route from '@ember/routing/route';
import ListRouteMixin from '@base-cms/parcel-plug-manage/mixins/list-route-mixin';

import query from '@base-cms/parcel-plug-manage/gql/queries/lineitem/list';
import search from '@base-cms/parcel-plug-manage/gql/queries/lineitem/match';

export default Route.extend(ListRouteMixin, {
  /**
   *
   * @param {object} params
   */
  model({ limit, field, order, phrase, searchType, searchBy }) {
    return this.getResults({
      query,
      queryKey: 'lineitems',
      search,
      searchKey: 'matchLineItems',
    }, { limit, field, order, phrase, searchType, searchBy });
  },
});


