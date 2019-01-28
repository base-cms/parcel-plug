import Service, { inject } from '@ember/service';
import { ObjectQueryManager } from 'ember-apollo-client';

import autocompleteAdvertisers from '@base-cms/parcel-plug-manage/gql/queries/advertiser/autocomplete';
import autocompleteAdUnits from '@base-cms/parcel-plug-manage/gql/queries/adunit/autocomplete';
import autocompleteDeployments from '@base-cms/parcel-plug-manage/gql/queries/deployment/autocomplete';
import autocompletePublishers from '@base-cms/parcel-plug-manage/gql/queries/publisher/autocomplete';
import autocompleteOrders from '@base-cms/parcel-plug-manage/gql/queries/order/autocomplete';
import autocompleteLineItems from '@base-cms/parcel-plug-manage/gql/queries/lineitem/autocomplete';

export default Service.extend(ObjectQueryManager, {
  graphErrors: inject(),

  /**
   * Gets the query and result key for the provided type.
   *
   * @param {string} type
   */
  getQueryFor(type) {
    switch (type) {
      case 'adunits':
        return { field: 'fullName', query: autocompleteAdUnits, resultKey: 'matchAdUnits' };
      case 'advertisers':
        return { field: 'name', query: autocompleteAdvertisers, resultKey: 'matchAdvertisers' };
      case 'deployments':
        return { field: 'fullName', query: autocompleteDeployments, resultKey: 'matchDeployments' };
      case 'publishers':
        return { field: 'name', query: autocompletePublishers, resultKey: 'matchPublishers' };
      case 'orders':
        return { field: 'fullName', query: autocompleteOrders, resultKey: 'matchOrders' };
      case 'lineitems':
        return { field: 'fullName', query: autocompleteLineItems, resultKey: 'matchLineItems' };
      default:
        throw new Error(`The autocomplete type '${type}' is not registered.`);
    }
  },

  /**
   * Runs an autocomplete query.
   *
   * @param {string} type
   * @param {string} phrase
   * @param {object} options
   * @param {object} options.pagination
   * @param {object} options.vars
   */
  async query(type, phrase, { pagination, vars } = {}) {
    const { field, query, resultKey } = this.getQueryFor(type);
    const input = {
      pagination: pagination || { limit: 20 },
      field,
      phrase,
      position: 'contains',
      ...vars,
    };
    const variables = { input };

    try {
      const results = await this.get('apollo').watchQuery({ query, variables, fetchPolicy: 'network-only' }, resultKey);
      return results.edges.map(edge => edge.node);
    } catch (e) {
      this.get('graphErrors').show(e);
    }
  },
});
