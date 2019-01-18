const { SchemaDirectiveVisitor } = require('graphql-tools');
const handleValidation = require('../utils/handle-validation');
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

      if (value === false || value === 0) {
        doc.set(path, value);
      } else {
        doc.set(path, value || undefined);
      }
      return handleValidation(doc);
    };
  }
}

module.exports = SetAndUpdateDirective;
