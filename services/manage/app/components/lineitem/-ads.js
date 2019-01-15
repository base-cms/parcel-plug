import Component from '@ember/component';

export default Component.extend({
  classNames: ['accordian z-depth-half'],
  elementId: 'ads-accordian',

  activeUID: null,

  init() {
    this._super(...arguments);
    if (!Array.isArray(this.get('ads'))) {
      this.set('ads', []);
    }
  },

  actions: {
    toggle(uid) {
      const active = this.get('activeUID');
      this.set('activeUID', uid === active ? null : uid);
    },
  },
});
