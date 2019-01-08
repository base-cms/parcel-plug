import Mixin from '@ember/object/mixin';
import { computed } from '@ember/object';

export default Mixin.create({
  /**
   * Whether validation was attempted on the field.
   */
  wasValidated: false,

  /**
   * Whether the field is considered valid.
   * A valid field is one with a falsey `validationMessage`.
   * Otherwise the field is considered invalid.
   */
  isValid: computed('validationMessage', function() {
    const message = this.get('validationMessage');
    if (message) return false;
    return true;
  }),

  /**
   * Computes the validity class based on whether the field has been validated
   * and it's current validity state.
   */
  validityClass: computed('isValid', 'wasValidated', function() {
    if (!this.get('wasValidated')) return false;
    return this.get('isValid') ? 'is-valid' : 'is-invalid';
  }),

  /**
   * The validation message.
   * If set, the field is considered invalid.
   */
  validationMessage: '',

  /**
   * Validates the element.
   * Supports custom validation by providing a `validator` function property on this component.
   * If a custom validation function is called, it is up to the
   * function to set the elements validation message via `element.setCustomValidity()`
   *
   * @see https://developer.mozilla.org/en-US/docs/Web/API/HTMLInputElement
   */
  validate() {
    const { element } = this;
    const fn = this.get('validator');
    if (typeof fn === 'function') {
      fn(element);
    }
    element.checkValidity();
    const { validationMessage } = element;
    this.set('validationMessage', validationMessage);
    this.set('wasValidated', true);
  },
});
