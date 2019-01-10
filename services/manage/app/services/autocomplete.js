import Service, { inject } from '@ember/service';
import { ObjectQueryManager } from 'ember-apollo-client';

import autocompletePublishers from '@base-cms/parcel-plug-manage/gql/queries/publisher/autocomplete';

export default Service.extend(ObjectQueryManager, {
  graphErrors: inject(),

  /**
   * Gets the query and result key for the provided type.
   *
   * @param {string} type
   */
  getQueryFor(type) {
    switch (type) {
      case 'publishers':
        return { field: 'name', query: autocompletePublishers, resultKey: 'matchPublishers' };
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
