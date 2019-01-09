const { SchemaDirectiveVisitor } = require('graphql-tools');
const { ApolloError } = require('apollo-server-express');
const { account: connection } = require('../../mongoose/connections');

class SetAndUpdateDirective extends SchemaDirectiveVisitor {
  /**
   *
   * @param {*} field
   */
  visitFieldDefinition(field) {
    const { resolve } = field;
    const { modelName, path } = this.args;

    // eslint-disable-next-line no-param-reassign
    field.resolve = async (...args) => {
      const [, { input }, { auth }] = args;
      if (typeof resolve === 'function') await resolve(...args);
      const { id, value } = input;
      const Model = connection.model(modelName);
      const doc = await Model.strictFindActiveById(id);
      doc.setUserContext(auth.user);
      doc.set(path, value || undefined);
      try {
        const saved = await doc.save();
        return saved;
      } catch (e) {
        if (e.name === 'ValidationError') throw new ApolloError(e.message, 'VALIDATION_ERROR', e.errors);
        throw e;
      }
    };
  }
}

module.exports = SetAndUpdateDirective;
