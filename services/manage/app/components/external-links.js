import Component from '@ember/component';
import { isArray } from '@ember/array';
import { get, set } from '@ember/object';
import { debounce } from '@ember/runloop';

export default Component.extend({
  isModalShowing: false,

  isCreating: false,
  typeDelay: 750,
  error: null,

  init() {
    this._super(...arguments);
    if (!isArray(this.get('value'))) {
      this.set('value', []);
    } else {
      this.set('value', this.get('value').slice());
    }
  },

  /**
   * Sends the on-change events.
   * Will only fire when the field is valid.
   *
   * @param {string} value
   * @param {Event} event
   */
  async sendOnChange(val) {
    const value = val.map(link => ({ label: link.label, url: link.url }));
    const fn = this.get('on-change');
    if (typeof fn === 'function') {
      this.set('isChanging', true);
      try {
        await fn(value);
        this.set('changeComplete', true);
      } catch (e) {
        this.set('error', e);
        throw this.get('graphErrors').handle(e);
      } finally {
        this.set('isChanging', false);
      }
    }
  },

  /**
   * Debounces the input onchange event.
   *
   * Will immediately fire the change, if dirty, and
   * will cancel any other pending change events.
   *
   * @param {Event} event
   */
  debounceChange(event) {
    this.set('error', null);
    const value = this.get('value');
    if (this.get('shouldSave')) {
      debounce(this, 'sendOnChange', value, event, 1, true);
    } else {
      this.sendOnChange(value, event);
    }
  },

  actions: {
    createLink() {
      this.get('value').pushObject({ label: 'New Link', url: '' });
    },
    removeLink(link) {
      this.get('value').removeObject(link);
        this.debounceChange();
    },

    setLinkUrl(link, { event }) {
      const { target } = event;
      const { value} = target;
      if (get(link, 'url') !== value) {
        set(link, 'url', value);
        this.debounceChange(event);
      }
    },

    setLinkLabel(link, { event }) {
      const { target } = event;
      const { value} = target;
      if (get(link, 'label') !== value) {
        set(link, 'label', value);
        this.debounceChange(event);
      }
    },
  },
});
