import Component from '@ember/component';

export default Component.extend({
  tagName: 'form',
  attributeBindings: ['novalidate'],
  novalidate: true,

  shouldAutosave: true,
  disabled: false,

  init() {
    this._super(...arguments);
    this.set('_formElements', []);
  },

  /**
   * Submit the form.
   * When autosave is enabled, the form will not submit as a whole
   * and, instead, will submit on a per-field basis.
   *
   * When autosave is disabled, the `on-submit` event will be fired
   * when the form is valid.
   */
  submit(event) {
    event.preventDefault();
    event.stopPropagation();
    if (!this.get('shouldAutosave')) {
      // Only submit the entire form when auto-save is disabled.
      const form = this.element;
      // Check the validity of all child form components.
      this.get('_formElements').forEach((element) => element.validate());
      // And only submit when valid.
      if (form.checkValidity()) this.get('on-submit')();
    }
  },

  actions: {
    /**
     * Adds an form element component (e.g. `input` etc) to this instance.
     * Will automatically add any elements on insert that are registered
     * as a child component.
     *
     * @param {*} component
     */
    addFormElement(component) {
      this.get('_formElements').pushObject(component);
    },

    removeFormElement(component) {
      this.get('_formElements').removeObject(component);
    },
  },
});
