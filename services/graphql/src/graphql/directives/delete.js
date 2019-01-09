const { SchemaDirectiveVisitor } = require('graphql-tools');
const handleValidation = require('../utils/handle-validation');
const { account: connection } = require('../../mongoose/connections');

class DeleteDirective extends SchemaDirectiveVisitor {
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
      const { id } = input;
      const Model = connection.model(modelName);
      const doc = await Model.strictFindActiveById(id);
      doc.setUserContext(auth.user);
      doc.set('deleted', true);
      return handleValidation(doc);
    };
  }
}

module.exports = DeleteDirective;
