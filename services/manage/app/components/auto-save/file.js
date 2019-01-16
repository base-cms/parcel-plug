import Component from '@ember/component';
import { computed } from '@ember/object';
import OnInsertMixin from '../form-elements/mixins/on-insert';

export default Component.extend(OnInsertMixin, {
  /**
   * Tagless wrapping component.
   */
  tagName: '',

  /**
   * Whether the change event should be saved.
   */
  shouldSave: true,

  /**
   * Whether to set the element to readonly
   * while the element is in the middle of a change.
   */
  readOnlyWhileChanging: true,

  id: computed('formId', function() {
    const { formId, name } = this.getProperties('formId', 'name');
    if (formId && name) return `${formId}-${name}`;
    return undefined;
  }),

  /**
   * Determines if the field should be readonly.
   * Is passed to the input element.
   * Forces the field into readonly mode while changing, or if
   * passed to the component.
   */
  _readonly: computed('readonly', 'shouldSave', 'isChanging', 'readOnlyWhileChanging', function() {
    if (this.get('readonly')) return true;
    if (!this.get('shouldSave')) return false;
    if (!this.get('readOnlyWhileChanging')) return false;
    return this.get('isChanging');
  }),

  /**
   * Whether the change event is currently being processed.
   */
  isChanging: false,

  /**
   * An error that was received when the on change event occured.
   */
  changeError: null,

  /**
   * Whether the change event has completed.
   */
  changeComplete: false,

  /**
   * Sends the on-change events.
   * Will only fire when the field is valid.
   *
   * @param {string} value
   */
  async sendOnChange(files) {
    this.resetState();
    this.validate();
    const fn = this.get('on-change');
    if (typeof fn === 'function' && this.get('_child.isValid')) {
      this.set('isChanging', true);
      try {
        await fn(files);
        this.set('changeComplete', true);
      } catch (e) {
        this.set('_child.validationMessage', e.message);
        const onError = this.get('on-error');
        if (typeof onError === 'function') {
          onError(e);
        }
      } finally {
        this.set('isChanging', false);
      }
    }
  },

  /**
   * Resets the change state of this component.
   */
  resetState() {
    this.set('changeError', null);
    this.set('changeComplete', false);
  },

  /**
   * Resets the validity state of the child component.
   */
  resetValidity() {
    this.set('_child.wasValidated', false);
    this.set('_child.validationMessage', '');
  },

  /**
   * Validates the wrapped/child input component.
   * Supports custom validation by providing a `validator` function property on this component.
   * If a custom validation function is called, it is up to the
   * function to set the elements validation message via `element.setCustomValidity()`
   *
   * @see https://developer.mozilla.org/en-US/docs/Web/API/HTMLInputElement
   */
  validate() {
    const child = this.get('_child');
    child.validate();
  },

  actions: {
    /**
     * Sets the wrapped/child, `input` component so it can
     * be accessed in this context.
     *
     * @param {Component} component
     */
    setChildInputComponent(component) {
      this.set('_child', component);
    },
  },
});
