import Mixin from '@ember/object/mixin';

export default Mixin.create({
  /**
   * Fires the `on-insert` event with this component instance.
   */
  didInsertElement() {
    this._super(...arguments);
    const fn = this.get('on-insert');
    if (typeof fn === 'function') {
      fn(this);
    }
  },

  /**
   * Fires the `on-destroy` event with this component instance.
   */
  willDestroyElement() {
    this._super(...arguments);
    const fn = this.get('on-destroy');
    if (typeof fn === 'function') {
      fn(this);
    }
  },
});
