import Component from '@ember/component';

export default Component.extend({
  tagName: 'small',
  classNames: ['d-block'],
  format: 'MMM Do, YYYY @ h:mma',
  label: 'Created',

  date: null,
  user: null,
});
