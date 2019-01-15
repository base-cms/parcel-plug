import Component from '@ember/component';

export default Component.extend({
  classNames: ['form-group'],
  value: null,
  options: null,
  init() {
    this._super(...arguments);
    this.set('options', [
      { key: 'Member', label: 'Standard User' },
      { key: 'Admin', label: 'Administrator' },
    ]);
  },
});
