const { ApolloError } = require('apollo-server-express');
const User = require('../../mongoose/models/user');
const userService = require('../../services/user');

module.exports = {
  /**
   *
   */
  Mutation: {
    /**
     *
     */
    createUser: (_, { input }) => {
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
  },
};
