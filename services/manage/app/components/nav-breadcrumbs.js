import Component from '@ember/component';

export default Component.extend({
  tagName: 'nav',
  attributeBindings: ['aria-label'],
  wrapperClass: 'breadcrumb border-0 h2 bg-transparent my-1',

  'aria-label': 'breadcrumb',
});
