const { SchemaDirectiveVisitor } = require('graphql-tools');
const { AuthenticationError, ApolloError } = require('apollo-server-express');

class AuthDirective extends SchemaDirectiveVisitor {
  /**
   *
   * @param {*} field
   */
  visitFieldDefinition(field) {
    const { resolve } = field;
    const { requiresRole } = this.args;

    // eslint-disable-next-line no-param-reassign
    field.resolve = function checkAuth(...args) {
      const [, , { auth }] = args;
      if (!auth.isValid()) {
        throw new AuthenticationError('You must be logged-in to access this resource.');
      }
      if (requiresRole && !auth.hasRole(requiresRole)) {
        throw new ApolloError('You do not have permission to access this resource.', 'UNAUTHORIZED');
      }
      return resolve.apply(this, args);
    };
  }
}

module.exports = AuthDirective;
