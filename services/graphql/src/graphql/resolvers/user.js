const User = require('../../mongoose/models/user');

module.exports = {
  /**
   *
   */
  Mutation: {
    /**
     *
     */
    createUser: (_, { input }) => {
      // @todo Check admin auth!
      const {
        email,
        givenName,
        familyName,
        password,
        confirmPassword,
        role,
      } = input;
      User.validatePassword(password, confirmPassword);
      return User.create({
        email,
        givenName,
        familyName,
        password,
        role,
      });
    },
  },
};
