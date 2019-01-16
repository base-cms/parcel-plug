import Route from '@ember/routing/route';

export default Route.extend({
  model() {
    return {
      image: {},
    };
  },

  setupController(controller, model) {
    controller.set('lineitem', this.modelFor('manage.orders.edit.lineitems.edit'));
    this._super(controller, model);
  },
});

