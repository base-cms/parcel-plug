import Route from '@ember/routing/route';

export default Route.extend({
  model({ lineitem_id }) {
    return { id: lineitem_id };
  },
});

