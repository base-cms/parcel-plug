import Component from '@ember/component';
import { computed, observer } from '@ember/object';
import { task, timeout } from 'ember-concurrency';
import ValidityMixin from './mixins/validity';
import OnInsertMixin from './mixins/on-insert';

export default Component.extend(OnInsertMixin, ValidityMixin, {
  /**
   * The selected value.
   * Is passed to `power-select` as `selected`.
   * If `mulitple` is `true`, must be an array.
   */
  value: null,

  closeOnSelect: true,
  allowClear: true,
  multiple: false,
  timeout: 600,

  required: false,
  placeholder: null,
  disabled: false,

  /**
   * Computes the class names to be added to the power select component.
   */
  _triggerClass: computed('triggerClass', 'validityClass', function() {
    const classes = [];
    classes.push(this.get('triggerClass'), this.get('validityClass'));
    return classes.filter(c => c).join(' ');
  }).readOnly(),

  /**
   * Ensures that the validation message is set to the hidden input element
   * when changed.
   */
  setInputValidity: observer('validationMessage', function() {
    this.get('_input').setCustomValidity(this.get('validationMessage'));
  }),

  /**
   * Ensures a multiple value is an array and sets the internal
   * value used by the power select component.
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
   * @param {*} value
   */
  change(value) {
    // Reset the internal validation states.
    this.set('validationMessage', '');
    // Set the internal value.
    this.set('_value', value);
    const fn = this.get('on-change');
    if (typeof fn === 'function') {
      fn(...arguments);
    }
  },

  /**
   * This is here to mimic the `checkValidity` method of a
   * traditional input element.
   */
  checkValidity() {
    if (this.get('validationMessage')) return false;

    const validationMessage = 'Please fill out this field.';
    const value = this.get('_value');
    const { required, multiple } = this.getProperties('required', 'multiple');

    if (required && multiple && (!value || !value.length)) {
      this.set('validationMessage', validationMessage);
      return false;
    }
    if (required && !multiple && !value) {
      this.set('validationMessage', validationMessage);
      return false;
    }
    return true;
  },

  /**
   * This is here to mimic the `setCustomValidity` method of a
   * traditional input element.
   */
  setCustomValidity(validationMessage) {
    this.set('validationMessage', validationMessage);
  },

  /**
   * Validates the element.
   * Overridden to "mimic" the `checkValidity` and `setCustomValidity` methods
   * of a real input element. Instead of sending the element to the action, will send
   * the instance of this component.
   */
  validate() {
    const fn = this.get('validator');
    if (typeof fn === 'function') {
      fn(this.get('_value'), this);
    }
    this.checkValidity();
    this.set('wasValidated', true);
  },

  /**
   * Performs the search task by sending the `on-search` action.
   */
  search: task(function* (phrase) {
    yield timeout(this.get('timeout'));
    const fn = this.get('on-search');
    if (typeof fn === 'function') {
      return fn(phrase, this);
    }
  }),

  actions: {
    /**
     * Sets the hidden input element for this typeahead instance.
     * Is needed in order to prevent form submissions when invalid, since
     * form validity is checked via `form.isValid()`.
     *
     * @param {*} instance
     */
    setInputElement(instance) {
      this.set('_input', instance.element);
    },
  },
});
