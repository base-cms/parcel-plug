import Component from '@ember/component';
import { computed } from '@ember/object';

export default Component.extend({
  tagName: '',
  isSaving: false,

  _disabled: computed('disabled', 'isSaving', function() {
    if (this.get('disabled')) return true;
    return this.get('isSaving');
  }),
});
