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
      const {
        id,
        file,
        width,
        height,
        bytes,
      } = input;
      const ad = await Ad.strictFindActiveById(id);
      ad.setUserContext(auth.user);
      return ad.uploadImage(file, { width, height, bytes });
    },
  },
};
