const Advertiser = require('../../mongoose/models/advertiser');

module.exports = {
  /**
   *
   */
  Mutation: {
    /**
     *
     */
    createAdvertiser: (_, { input }, { auth }) => {
      const advertiser = new Advertiser(input);
      advertiser.setUserContext(auth.user);
      return advertiser.save();
    },

    /**
     *
     */
    updateAdvertiser: async (_, { input }, { auth }) => {
      const { id, payload } = input;
      const advertiser = await Advertiser.strictFindActiveById(id);
      advertiser.setUserContext(auth.user);
      advertiser.set(payload);
      return advertiser.save();
    },

    /**
     *
     */
    deleteAdvertiser: async (_, { input }, { auth }) => {
      const { id } = input;
      const advertiser = await Advertiser.strictFindActiveById(id);
      advertiser.setUserContext(auth.user);
      return advertiser.softDelete();
    },
  },

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
