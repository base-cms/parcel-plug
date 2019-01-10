const Deployment = require('../../mongoose/models/deployment');

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
};
