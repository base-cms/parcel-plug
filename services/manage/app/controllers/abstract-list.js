import Controller from '@ember/controller';
import { computed } from '@ember/object';

export default Controller.extend({
  /**
   * Query params
   */
  queryParams: null,

  /**
   * Pagination
   */
  limit: 20,

  /**
   * Search
   */
  phrase: '',
  searchType: 'contains',
  searchBy: 'name',

  /**
   * Sort
   */
  field: 'id',
  order: 'desc',

  isSortDisabled: computed('phrase.length', function() {
    return this.get('phrase.length') > 0;
  }),

  init() {
    this._super(...arguments);
    this.set('queryParams', ['limit', 'field', 'order', 'phrase', 'seachType', 'searchBy']);

    // Should be overriden by the specific controller for different options.
    this.set('searchFields', [
      { key: 'name', label: 'Name' },
    ]);
    this.set('sortOptions', [
      { key: 'updatedAt', label: 'Updated' },
    ]);
    this.set('limitOptions', [10, 20, 50, 100, 200]);
    this.set('field', 'updatedAt');
  },

  actions: {
    search(phrase) {
      this.set('phrase', phrase);
    },
  },
});
