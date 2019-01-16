const Ad = require('../../mongoose/models/ad');

module.exports = {
  /**
   *
   */
  Mutation: {
    /**
     *
     */
    adImage: async (_, { input }, { auth }) => {
      const { id, value: file } = input;
      const ad = await Ad.strictFindActiveById(id);
      ad.setUserContext(auth.user);
      return ad.uploadImage(file);
    },
  },
};
