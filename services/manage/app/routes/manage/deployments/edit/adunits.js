import Route from '@ember/routing/route';
import ListRouteMixin from '@base-cms/parcel-plug-manage/mixins/list-route-mixin';

import query from '@base-cms/parcel-plug-manage/gql/queries/adunit/list-for-deployment';
import search from '@base-cms/parcel-plug-manage/gql/queries/adunit/match-for-deployment';

export default Route.extend(ListRouteMixin, {
  /**
   *
   * @param {object} params
   */
  model({ limit, field, order, phrase, searchType, searchBy }) {
    const input = {
      deploymentId: this.modelFor('manage.deployments.edit').id,
    };
    return this.getResults({
      query,
      queryKey: 'adunitsForDeployment',
      queryInput: input,
      search,
      searchKey: 'matchAdUnitsForDeployment',
      searchInput: input,
    }, { limit, field, order, phrase, searchType, searchBy });
  },
});


