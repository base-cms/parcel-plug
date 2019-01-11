import Component from '@ember/component';
import { computed } from '@ember/object';

export default Component.extend({
  tagName: 'button',
  classNames: ['btn', 'btn-lg', 'btn-success', 'fixed-bottom'],
  attributeBindings: ['title'],
  icon: '',
  title: 'Create New Record',

  hasIconComponent: computed('icon', function() {
    const icon = this.get('icon');
    return icon && typeof icon === 'object';
  }),
});
