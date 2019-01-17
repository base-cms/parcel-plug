import Component from '@ember/component';
import { computed } from '@ember/object';

export default Component.extend({
  tagName: 'span',
  classNameBindings: ['color'],

  status: null,

  color: computed('status', function() {
    switch (this.get('status')) {
      case 'Deleted':
        return 'text-danger'
      case 'Incomplete':
        return 'text-warning';
      case 'Active':
        return 'text-success';
      default:
        return 'text-muted';
    }
  }),
});
