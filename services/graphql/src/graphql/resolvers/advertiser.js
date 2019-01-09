const Advertiser = require('../../mongoose/models/advertiser');

module.exports = {
  /**
   *
   */
  Query: {
    /**
     *
     */
    advertisers: (_, { input }) => {
      const { sort, pagination } = input;
      const query = { deleted: false };
      return Advertiser.paginate({ query, sort, ...pagination });
    },
  },
};
