const reportingService = require('../../services/reporting');

module.exports = {
  /**
   *
   */
  Query: {
    report: (_, { input }) => reportingService(input),
  },
};
