import Component from '@ember/component';
import { computed } from '@ember/object';
import { htmlSafe } from '@ember/string';
import ValidityMixin from './mixins/validity';
import OnInsertMixin from './mixins/on-insert';

export default Component.extend(OnInsertMixin, ValidityMixin, {
  tagName: 'input',
  classNameBindings: ['validityClass'],
  attributeBindings: [
    'aria-describedby',
    'autocomplete',
    'autofocus',
    'data-label',
    'disabled',
    'max',
    'maxlength',
    'min',
    'name',
    'pattern',
    'placeholder',
    'readonly',
    'required',
    'step',
    'style',
    'tabindex',
    'type',
    'value:value',
  ],

  /**
   * The default input type.
   */
  type: 'text',

  /**
   * The input value.
   */
  value: '',

  /**
   * Whether to show the element.
   */
  show: true,

  style: computed('show', function() {
    const style = this.get('show') ? '' : 'display: none;';
    return htmlSafe(style);
  }).readOnly(),
});
