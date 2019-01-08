import Component from '@ember/component';

export default Component.extend({
  tagName: 'button',
  classNames: ['btn', 'btn-lg', 'btn-success', 'fixed-bottom'],
  attributeBindings: ['title'],
  icon: '',
  title: 'Create New Record',
});
