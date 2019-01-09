const { ApolloError } = require('apollo-server-express');

module.exports = async (doc) => {
  try {
    const saved = await doc.save();
    return saved;
  } catch (e) {
    if (e.name === 'ValidationError') throw new ApolloError(e.message, 'VALIDATION_ERROR', e.errors);
    throw e;
  }
};
