const { GraphQLScalarType } = require('graphql');
const { Kind } = require('graphql/language');

module.exports = new GraphQLScalarType({
  name: 'Date',
  description: 'Date custom scalar type',
  parseValue(value) {
    if (!value) return null;
    return new Date(parseInt(value, 10));
  },
  serialize(value) {
    if (typeof value === 'string') {
      const parsed = Date.parse(value);
      return parsed || null;
    }
    if (!(value instanceof Date)) return null;
    return value.getTime();
  },
  parseLiteral(ast) {
    if (ast.kind === Kind.INT) {
      return new Date(parseInt(ast.value, 10));
    }
    return null;
  },
});
