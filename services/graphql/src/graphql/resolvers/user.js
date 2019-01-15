const { ApolloError } = require('apollo-server-express');
const User = require('../../mongoose/models/user');
const userService = require('../../services/user');
const sessionService = require('../../services/session');
const handleValidation = require('../utils/handle-validation');

module.exports = {
  /**
   *
   */
  Query: {
    /**
     *
     */
    checkSession: async (_, { input }) => {
      const { token } = input;
      const { user, session } = await userService.retrieveSession(token);
      return { user, session };
    },
  },

  /**
   *
   */
  Mutation: {
    /**
     *
     */
    createUser: (_, { input }, { auth }) => {
      const {
        email,
        givenName,
        familyName,
        password,
        confirmPassword,
        role,
      } = input;
      User.validatePassword(password, confirmPassword);
      const user = new User({
        email,
        givenName,
        familyName,
        password,
        confirmPassword,
        role,
      });
      user.setUserContext(auth.user);
      return handleValidation(user);
    },

    /**
     *
     */
    loginUser: async (_, { input }) => {
      const { email, password } = input;
      try {
        const response = await userService.login(email, password);
        return response;
      } catch ({ message }) {
        throw new ApolloError(message, 'LOGIN_ERROR');
      }
    },

    /**
     *
     */
    logoutUser: async (_, args, { auth }) => {
      if (auth.isValid()) {
        await sessionService.delete(auth.session);
        return 'ok';
      }
      return null;
    },

    /**
     *
     */
    changeUserPassword: async (_, { input }, { auth }) => {
      const { id, value, confirm } = input;
      if (`${auth.user.id}` === `${id}` || auth.isAdmin()) {
        User.validatePassword(value, confirm);
        const user = await User.strictFindById(id);
        user.setUserContext(auth.user);
        user.password = value;
        return handleValidation(user);
      }
      throw new Error('Only administrators can change passwords for other users.');
    },

    /**
     *
     */
    updateCurrentUserProfile: (_, { input }, { auth }) => {
      const { givenName, familyName } = input;
      const { user } = auth;
      user.setUserContext(auth.user);
      user.set({ givenName, familyName });
      return handleValidation(user);
    },
  },
};
