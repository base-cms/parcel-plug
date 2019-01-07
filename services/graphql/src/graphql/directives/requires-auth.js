const { SchemaDirectiveVisitor } = require('graphql-tools');
const { AuthenticationError, ApolloError } = require('apollo-server-express');

class RequiresAuthDirective extends SchemaDirectiveVisitor {
  /**
   *
   * @param {*} field
   */
  visitFieldDefinition(field) {
    const { resolve } = field;
    const { role } = this.args;

    // eslint-disable-next-line no-param-reassign
    field.resolve = function checkAuth(...args) {
      const [doc, , { auth }] = args;
      if (!auth.isValid()) {
        throw new AuthenticationError('You must be logged-in to access this resource.');
      }
      if (role && !auth.hasRole(role)) {
        throw new ApolloError('You do not have permission to access this resource.', 'UNAUTHORIZED');
      }
      // Apply user attribution where applicable.
      if (doc && typeof doc.setUserContext === 'function') {
        doc.setUserContext(auth.user);
      }

      return resolve.apply(this, args);
    };
  }
}

module.exports = RequiresAuthDirective;
