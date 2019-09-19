const { SchemaDirectiveVisitor } = require('graphql-tools');
const escapeRegex = require('escape-string-regexp');
const { account: connection } = require('../../mongoose/connections');
const applyInput = require('../utils/apply-input');

const { isArray } = Array;

const buildRegex = (term, position) => {
  let start = '';
  let end = '';
  if (position === 'starts') {
    start = '^';
  } else if (position === 'ends') {
    end = '$';
  } else if (position === 'exact') {
    start = '^';
    end = '$';
  }
  const value = escapeRegex(term);
  return new RegExp(`${start}${value.replace(/\s\s+/, ' ').replace(' ', '.+?')}${end}`, 'i');
};

class MatchManyDirective extends SchemaDirectiveVisitor {
  /**
   *
   * @param {*} field
   */
  visitFieldDefinition(field) {
    const { resolve } = field;
    const { modelName, using } = this.args;

    // eslint-disable-next-line no-param-reassign
    field.resolve = async (...args) => {
      const [, { input }] = args;
      if (typeof resolve === 'function') await resolve(...args);
      const {
        pagination,
        field: searchField,
        phrase,
        excludeIds = [],
        position,
      } = input;

      const query = applyInput({
        query: {
          [searchField]: buildRegex(phrase, position),
          deleted: false,
        },
        using,
        input,
      });
      if (isArray(excludeIds) && excludeIds.length) {
        query._id = { $nin: excludeIds };
      }
      const sort = { field: searchField, order: 'asc' };
      const Model = connection.model(modelName);
      return Model.paginate({ query, sort, ...pagination });
    };
  }
}

module.exports = MatchManyDirective;
