const { SchemaDirectiveVisitor } = require('graphql-tools');
const { account: connection } = require('../../mongoose/connections');

class RefOneDirective extends SchemaDirectiveVisitor {
  /**
   *
   * @param {*} field
   */
  visitFieldDefinition(field) {
    const {
      modelName,
      localField,
      foreignField,
    } = this.args;

    // eslint-disable-next-line no-param-reassign
    field.resolve = async (...args) => {
      const Model = connection.model(modelName);
      const [doc] = args;

      const value = doc.get(localField);
      if (!value) return null;

      const query = {
        [foreignField]: value,
        deleted: false,
      };
      return Model.findOne(query);
    };
  }
}

module.exports = RefOneDirective;
