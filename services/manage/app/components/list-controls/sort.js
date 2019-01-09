import Component from '@ember/component';
import { computed } from '@ember/object';
import { isArray } from '@ember/array';
import MenuMixin from '@base-cms/parcel-plug-manage/components/list-controls/menu-mixin';

export default Component.extend(MenuMixin, {
  classNames: ['btn-group'],
  attributeBindings: ['role', 'aria-label'],

  role: 'group',
  'aria-label': 'Sort filter',

  /**
   * The sort field value, e.g. `createdAt` or `name`.
   * @public
   * @type {string}
   */
  field: null,

  /**
   * The sort order; either `asc` or `desc`
   * @public
   * @type {boolean}
   */
  order: 'asc',

  /**
   * Whether the sort dropdown control is completely disabled.
   * @public
   * @type {boolean}
   */
  disabled: false,

  /**
   * The class to apply to buttons within this group
   * @public
   * @type {string}
   */
  buttonClass: 'btn-primary',

  ascending: computed('order', function() {
    return this.get('order') === 'asc';
  }),

  /**
   * Based on the `field` value, computes the selected sort object.
   * For example, if the `field` value equals `createdAt`, this would return
   * something like `{ key: 'createdAt', label: 'Created' }`.
   */
  selected: computed('options.[]', 'field', function() {
    return this.get('options').findBy('key', this.get('field'));
  }),

  /**
   * Displays filtered sort options by removing the currently selected `field` value.
   * Returns an array of sort option objects.
   */
  filteredOptions: computed('options.[]', 'field', function() {
    return this.get('options').rejectBy('key', this.get('field'));
  }),

  /**
   * Initializes the component.
   * If the `options` property is not an array, it will set it as an empty array.
   */
  init() {
    this._super(...arguments);
    if (!isArray(this.get('options'))) {
      this.set('options', []);
    }
  },

  actions: {
    toggleAscending() {
      const order = this.get('order');
      if (order === 'asc') {
        this.set('order', 'desc');
      } else if (order === 'desc') {
        this.set('order', 'asc');
      }
    },
    sortBy(key) {
      this.set('field', key);
    },
  },
});
