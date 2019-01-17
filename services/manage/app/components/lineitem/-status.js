import Component from '@ember/component';
import { computed } from '@ember/object';

export default Component.extend({
  tagName: 'span',
  classNameBindings: ['color'],

  status: null,

  color: computed('status', function() {
    switch (this.get('status')) {
      case 'Finished':
        return 'text-primary'
      case 'Deleted':
        return 'text-danger'
      case 'Incomplete':
        return 'text-warning';
      case 'Running':
        return 'text-success';
      case 'Scheduled':
        return 'text-info';
      default:
        return 'text-muted';
    }
  }),
});
