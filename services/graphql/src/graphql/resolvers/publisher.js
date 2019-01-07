const Deployment = require('../../mongoose/models/deployment');
const Publisher = require('../../mongoose/models/publisher');

module.exports = {
  /**
   *
   */
  Publisher: {
    deployments: ({ id }, { input }) => {
      const { sort, pagination } = input;
      const query = { publisherId: id, deleted: false };
      return Deployment.paginate({ query, sort, ...pagination });
    },
  },

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

    /**
     *
     */
    deletePublisher: async (_, { input }, { auth }) => {
      const { id } = input;
      const publisher = await Publisher.strictFindActiveById(id);
      publisher.setUserContext(auth.user);
      return publisher.softDelete();
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
