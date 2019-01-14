import Component from '@ember/component';
import { computed } from '@ember/object';
import moment from 'moment';

export default Component.extend({
  center: null,
  days: null,

  oldestDay: computed('days.[],length', function() {
    if (!this.get('days.length')) return moment();
    const oldest = this.get('days').map(d => d.valueOf()).sort()[0];
    return moment(oldest);
  }),

  init() {
    this._super(...arguments);
    this.set('center', this.get('oldestDay'));
  },
});
