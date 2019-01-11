import Route from '@ember/routing/route';

export default Route.extend({
  model() {
    return {};
  },

  setupController(controller, model) {
    controller.set('order', this.modelFor('manage.orders.edit'));
    this._super(controller, model);
  },
});

