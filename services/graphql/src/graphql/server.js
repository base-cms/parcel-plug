const { ApolloServer } = require('apollo-server-express');
const schema = require('./schema');

const { NODE_ENV } = process.env;
const isProduction = NODE_ENV === 'production';

module.exports = ({ app, endpoint }) => {
  const server = new ApolloServer({
    schema,
    playground: !isProduction ? { endpoint } : false,
    introspection: true,
  });
  server.applyMiddleware({ app, path: endpoint });
  return server;
};
