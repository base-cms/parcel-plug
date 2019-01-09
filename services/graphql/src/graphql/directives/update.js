const { SchemaDirectiveVisitor } = require('graphql-tools');
const handleValidation = require('../utils/handle-validation');
const { account: connection } = require('../../mongoose/connections');

class UpdateDirective extends SchemaDirectiveVisitor {
  /**
   *
   * @param {*} field
   */
  visitFieldDefinition(field) {
    const { resolve } = field;
    const { modelName } = this.args;

    // eslint-disable-next-line no-param-reassign
    field.resolve = async (...args) => {
      const [, { input }, { auth }] = args;
      if (typeof resolve === 'function') await resolve(...args);
      const { id, payload } = input;
      const Model = connection.model(modelName);
      const doc = await Model.strictFindActiveById(id);
      doc.setUserContext(auth.user);
      Object.keys(payload).forEach((key) => {
        const value = payload[key];
        if (typeof value !== 'undefined') {
          doc.set(key, value === null ? undefined : value);
        }
      });
      return handleValidation(doc);
    };
  }
}

module.exports = UpdateDirective;
