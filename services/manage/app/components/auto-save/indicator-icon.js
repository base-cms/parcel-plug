import Component from '@ember/component';

export default Component.extend({
  tagName: 'span',
  classNames: ['input-group-text'],

  isChanging: false,
  changeComplete: false,
  validationMessage: '',

});
