const Order = require('../../mongoose/models/order');

module.exports = {
  Mutation: {
    cloneOrder: async (_, { input: { id } }, { auth: { user } }) => {
      const doc = await Order.strictFindActiveById(id);
      return doc.clone(user);
    },
  },
};
