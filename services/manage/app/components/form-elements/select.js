import Component from '@ember/component';
import { computed } from '@ember/object';
import OnInsertMixin from './mixins/on-insert';
import ValidityMixin from './mixins/validity';

export default Component.extend(OnInsertMixin, ValidityMixin, {
  tagName: 'select',
  classNameBindings: ['validityClass'],
  attributeBindings: [
    'aria-describedby',
    'autocomplete',
    'autofocus',
    'disabled',
    'name',
    'required',
    'tabindex',
  ],

  required: false,
  disabled: false,

  /**
   * The selected value.
   */
  value: '',

  /**
   * The formatted value used by the input.
   * Is passed to the option elements.
   */
  selected: computed('_value', function() {
    const value = this.get('_value');
    return value;
  }),

  /**
   * Sets the internal value used by the select component.
   */
  init() {
    this._super(...arguments);
    if (this.get('multiple') && !Array.isArray(this.get('value'))) {
      this.set('value', []);
    }
    this.set('_value', this.get('value'));
  },

  /**
   * Sets the internal value and fires the `on-change` event.
   *
   * @param {*} event
   */
  change(event) {
    const { target } = event;
    const { value } = target;
    // Set the internal value.
    this.set('_value', value);
    const fn = this.get('on-change');
    if (typeof fn === 'function') {
      fn(value, event);
    }
  },
});
