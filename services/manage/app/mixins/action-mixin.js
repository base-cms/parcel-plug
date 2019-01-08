import Mixin from '@ember/object/mixin';
import LoadingMixin from '@base-cms/parcel-plug-manage/mixins/loading-mixin';

export default Mixin.create(LoadingMixin, {
  isActionRunning: false,

  startAction() {
    this.showLoading();
    this.set('isActionRunning', true);
  },

  endAction() {
    this.set('isActionRunning', false);
    this.hideLoading();
  },

  startRouteAction() {
    this.showLoading();
    const controller = this.controllerFor(this.get('routeName'));
    controller.set('isActionRunning', true);
  },

  endRouteAction() {
    const controller = this.controllerFor(this.get('routeName'));
    controller.set('isActionRunning', false);
    this.hideLoading();
  },
});
