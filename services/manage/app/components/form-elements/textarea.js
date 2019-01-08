import Component from '@ember/component';
import { computed, observer } from '@ember/object';
import { htmlSafe } from '@ember/string';
import ValidityMixin from './mixins/validity';
import OnInsertMixin from './mixins/on-insert';

export default Component.extend(OnInsertMixin, ValidityMixin, {
  tagName: 'textarea',
  classNameBindings: ['validityClass'],
  attributeBindings: [
    'aria-describedby',
    'autocomplete',
    'autofocus',
    'cols',
    'disabled',
    'maxlength',
    'minlength',
    'name',
    'placeholder',
    'readonly',
    'required',
    'rows',
    'style',
    'tabindex',
    'wrap',
  ],

  /**
   * The default input type.
   */
  type: 'text',

  /**
   * The input value.
   */
  value: '',

  _value: observer('value', function() {
    this.$().val(this.get('value'));
  }),

  didInsertElement() {
    this._super(...arguments);
    this.$().val(this.get('value'));
  },

  /**
   * Whether to show the element.
   */
  show: true,

  wrap: 'soft',

  style: computed('show', function() {
    const style = this.get('show') ? '' : 'display: none;';
    return htmlSafe(style);
  }).readOnly(),
});
