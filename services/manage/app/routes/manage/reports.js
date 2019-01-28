import Route from '@ember/routing/route';
import moment from 'moment';

import query from '@base-cms/parcel-plug-manage/gql/queries/reporting/list';
import RouteObservableMixin from '../../mixins/route-observable-mixin';

export default Route.extend(RouteObservableMixin, {
  /**
   *
   * @param {object} params
   */
  async model() {
    const start = moment().startOf('week').valueOf();
    const end = moment().endOf('week').valueOf();

    const input = { start, end };
    const variables = { input };

    try {
      const response = await this.get('apollo').watchQuery({ query, variables, fetchPolicy: 'network-only' }, 'report');
      return response;
    } catch (e) {
      this.get('graphErrors').show(e);
    }
  },
});


