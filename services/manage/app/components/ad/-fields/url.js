import Component from '@ember/component';

export default Component.extend({
  classNames: ['form-group'],
  value: null,

  name: 'url',
  label: 'Click URL',
  type: 'url',
});
