const { SchemaDirectiveVisitor } = require('graphql-tools');
const { account: connection } = require('../../mongoose/connections');

const { isArray } = Array;

class RefManyDirective extends SchemaDirectiveVisitor {
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
      const [doc, { input }] = args;
      const { sort, pagination } = input;

      const value = doc.get(localField);
      if (!value || (isArray(value) && !value.length)) return Model.paginateEmpty();

      const query = {
        [foreignField]: isArray(value) ? { $in: value } : value,
        deleted: false,
      };
      return Model.paginate({ query, sort, ...pagination });
    };
  }
}

module.exports = RefManyDirective;
