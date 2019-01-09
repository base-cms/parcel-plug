const { SchemaDirectiveVisitor } = require('graphql-tools');
const handleValidation = require('../utils/handle-validation');
const { account: connection } = require('../../mongoose/connections');

class CreateDirective extends SchemaDirectiveVisitor {
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
      const Model = connection.model(modelName);
      const doc = new Model(input);
      doc.setUserContext(auth.user);
      return handleValidation(doc);
    };
  }
}

module.exports = CreateDirective;
