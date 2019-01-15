import Component from '@ember/component';

export default Component.extend({
  classNames: ['accordian'],
  elementId: 'ads-accordian',

  activeId: null,

  init() {
    this._super(...arguments);
    if (!Array.isArray(this.get('ads'))) {
      this.set('ads', []);
    }
  },

  actions: {
    toggle(id) {
      const active = this.get('activeId');
      this.set('activeId', id === active ? null : id);
    },
  },
});
