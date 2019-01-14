import Component from '@ember/component';
import { computed } from '@ember/object';
import moment from 'moment';

const { isArray } = Array;

export default Component.extend({
  classNames: ['form-group'],

  start: null,
  end: null,
  days: null,
  type: null,

  showDateRange: computed('type', function() {
    return this.get('type') === 'range';
  }),

  _days: computed('days.[]', function() {
    return this.get('days').map(d => moment(d));
  }),

  _range: computed('start', 'end', function() {
    const start = this.get('start');
    const end = this.get('end');
    return {
      start: start ? moment(start) : null,
      end: end ? moment(end) : null,
    }
  }),

  init() {
    this._super(...arguments);
    this.set('options', [
      { key: 'range', label: 'By Range' },
      { key: 'days', label: 'By Days' },
    ]);
    const days = this.get('days');
    this.set('days', isArray(days) ? days : []);
    const type = this.get('type');
    this.set('type', type || 'days');
  },

  actions: {
    setType(value) {
      this.set('type', value);
    },

    setDays(value) {
      this.get('on-days-change')(value.map(d => d.valueOf()));
    },

    setRange(value) {
      const { start, end } = value;
      this.get('on-range-change')({
        start: start ? start.valueOf() : null,
        end: end ? end.valueOf() : null,
      });
    },
  },
});
