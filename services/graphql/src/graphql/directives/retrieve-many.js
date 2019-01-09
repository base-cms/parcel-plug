const { SchemaDirectiveVisitor } = require('graphql-tools');
const { account: connection } = require('../../mongoose/connections');

class RetrieveManyDirective extends SchemaDirectiveVisitor {
  /**
   *
   * @param {*} field
   */
  visitFieldDefinition(field) {
    const { resolve } = field;
    const { modelName } = this.args;

    // eslint-disable-next-line no-param-reassign
    field.resolve = async (...args) => {
      const [, { input }] = args;
      if (typeof resolve === 'function') await resolve(...args);
      const { sort, pagination } = input;
      const query = { deleted: false };
      const Model = connection.model(modelName);
      return Model.paginate({ query, sort, ...pagination });
    };
  }
}

module.exports = RetrieveManyDirective;
