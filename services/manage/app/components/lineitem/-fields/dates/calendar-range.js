import Component from '@ember/component';
import moment from 'moment';

export default Component.extend({
  center: null,
  range: null,

  init() {
    this._super(...arguments);
    const start = this.get('range.start');
    this.set('center', start || moment());
  },
});
