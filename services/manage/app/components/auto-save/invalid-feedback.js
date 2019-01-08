import Component from '@ember/component';
import { computed } from '@ember/object';
import { htmlSafe } from '@ember/string';

export default Component.extend({
  classNames: ['invalid-feedback'],
  attributeBindings: ['style'],
  message: '',

  style: computed('message', function() {
    const style = this.get('message') ? 'display: block;' : '';
    return htmlSafe(style);
  }).readOnly(),
});
