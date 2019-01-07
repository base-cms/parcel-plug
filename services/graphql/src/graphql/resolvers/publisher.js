const Publisher = require('../../mongoose/models/publisher');

module.exports = {
  /**
   *
   */
  Mutation: {
    /**
     *
     */
    createPublisher: (_, { input }, { auth }) => {
      const publisher = new Publisher(input);
      publisher.setUserContext(auth.user);
      return publisher.save();
    },

    /**
     *
     */
    updatePublisher: async (_, { input }, { auth }) => {
      const { id, payload } = input;
      const publisher = await Publisher.strictFindActiveById(id);
      publisher.setUserContext(auth.user);
      publisher.set(payload);
      return publisher.save();
    },
  },

  /**
   *
   */
  Query: {
    /**
     *
     */
    publisher: (_, { input }) => {
      const { id } = input;
      return Publisher.findActiveById(id);
    },

    /**
     *
     */
    publishers: (_, { input }) => {
      const { sort, pagination } = input;
      const query = { deleted: false };
      return Publisher.paginate({ query, sort, ...pagination });
    },
  },
};
