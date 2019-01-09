const Advertiser = require('../../mongoose/models/advertiser');

module.exports = {
  /**
   *
   */
  Query: {
    /**
     *
     */
    advertiser: (_, { input }) => {
      const { id } = input;
      return Advertiser.findActiveById(id);
    },

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
