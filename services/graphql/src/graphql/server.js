const { ApolloServer } = require('apollo-server-express');
const schema = require('./schema');
const { createLoaders } = require('../dataloaders');

const { NODE_ENV } = process.env;
const isProduction = NODE_ENV === 'production';

module.exports = ({ app, endpoint }) => {
  const loaders = createLoaders();

  const server = new ApolloServer({
    schema,
    playground: !isProduction ? { endpoint } : false,
    introspection: true,
    context: ({ req }) => {
      const { auth } = req;
      return {
        auth,
        load: async (loader, id) => {
          if (!loaders[loader]) throw new Error(`No dataloader found for '${loader}'`);
          return loaders[loader].load(id);
        },
      };
    },
  });
  server.applyMiddleware({ app, path: endpoint });
  return server;
};
