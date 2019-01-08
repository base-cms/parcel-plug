import Service from '@ember/service';

export default Service.extend({
  isShowing: false,
  show() {
    if (!this.get('isShowing')) {
      this.set('isShowing', true);
    }
  },
  hide() {
    window.setTimeout(() => this.set('isShowing', false), 100);
  },
});
