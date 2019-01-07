const Deployment = require('../../mongoose/models/deployment');

module.exports = {
  /**
   *
   */
  Mutation: {
    /**
     *
     */
    createDeployment: (_, { input }, { auth }) => {
      const deployment = new Deployment(input);
      deployment.setUserContext(auth.user);
      return deployment.save();
    },

    /**
     *
     */
    updateDeployment: async (_, { input }, { auth }) => {
      const { id, payload } = input;
      const deployment = await Deployment.strictFindActiveById(id);
      deployment.setUserContext(auth.user);
      deployment.set(payload);
      return deployment.save();
    },

    /**
     *
     */
    deleteDeployment: async (_, { input }, { auth }) => {
      const { id } = input;
      const deployment = await Deployment.strictFindActiveById(id);
      deployment.setUserContext(auth.user);
      return deployment.softDelete();
    },
  },

  /**
   *
   */
  Query: {
    /**
     *
     */
    deployment: (_, { input }) => {
      const { id } = input;
      return Deployment.findActiveById(id);
    },

    /**
     *
     */
    deployments: (_, { input }) => {
      const { sort, pagination } = input;
      const query = { deleted: false };
      return Deployment.paginate({ query, sort, ...pagination });
    },
  },
};
