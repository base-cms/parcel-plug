const Ad = require('../../mongoose/models/ad');

module.exports = {
  /**
   *
   */
  Ad: {
    requires: ad => ad.getRequirements(),
  },

  /**
   *
   */
  Mutation: {
    cloneAd: async (_, { input: { id } }, { auth: { user } }) => {
      const doc = await Ad.strictFindActiveById(id);
      return doc.clone(user);
    },
    createAd: (_, { input }, { auth }) => {
      const {
        name,
        width,
        height,
        url,
        active,
        image,
        lineitemId,
      } = input;
      const ad = new Ad({
        name,
        width,
        height,
        url,
        active,
        lineitemId,
      });
      ad.setUserContext(auth.user);
      return ad.uploadImage(image.file, {
        width: image.width,
        height: image.height,
        bytes: image.bytes,
      });
    },

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
