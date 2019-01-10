import Component from '@ember/component';
import { computed } from '@ember/object';

export default Component.extend({
  tagName: 'button',
  classNames: ['btn', 'clickable'],
  attributeBindings: ['disabled', 'type'],

  disabled: false,
  isRunning: false,
  type: 'button',

  icon: '',
  confirmIcon: '',
  iconClass: null,

  label: 'Action',
  confirmLabel: 'You Sure?',
  runningLabel: 'Running...',
  labelClass: null,

  onConfirm: null,

  hasConfirmed: false,

  _icon: computed('icon', 'confirmIcon', 'hasConfirmed', function() {
    const icon = this.get('icon');
    const confirmIcon = this.get('confirmIcon');
    if (!this.get('hasConfirmed')) return icon;
    return confirmIcon ? confirmIcon : icon;
  }),

  _label: computed('label', 'confirmLabel', 'hasConfirmed', function() {
    const label = this.get('label');
    const confirmLabel = this.get('confirmLabel');
    if (!this.get('hasConfirmed')) return label;
    return confirmLabel ? confirmLabel : label;
  }),

  click() {
    if (this.get('hasConfirmed')) {
      this.get('onConfirm')();
    } else {
      this.set('hasConfirmed', true);
    }
  },

  focusOut() {
    this.set('hasConfirmed', false);
  },
});
