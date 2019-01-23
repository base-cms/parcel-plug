const AdUnit = require('../../mongoose/models/adunit');
const Deployment = require('../../mongoose/models/deployment');
const LineItem = require('../../mongoose/models/lineitem');
const Publisher = require('../../mongoose/models/publisher');
const handleValidation = require('../utils/handle-validation');

const isObject = v => v && typeof v === 'object';

const { isArray } = Array;

module.exports = {
  LineItem: {
    targeting: ({ targeting }) => (isObject(targeting) ? targeting : {}),
    dates: ({ dates }) => (isObject(dates) ? dates : {}),
    requires: lineitem => lineitem.getRequirements(),
  },

  LineItemTargeting: {
    adunits: ({ adunitIds }) => {
      if (!isArray(adunitIds)) return [];
      return AdUnit.findActive({ _id: { $in: adunitIds } });
    },
    deployments: ({ deploymentIds }) => {
      if (!isArray(deploymentIds)) return [];
      return Deployment.findActive({ _id: { $in: deploymentIds } });
    },
    publishers: ({ publisherIds }) => {
      if (!isArray(publisherIds)) return [];
      return Publisher.findActive({ _id: { $in: publisherIds } });
    },
  },

  LineItemDates: {
    days: ({ days }) => (isArray(days) ? days : []),
  },

  Mutation: {
    lineitemDateDays: async (_, { input }, { auth }) => {
      const { id, days } = input;
      const doc = await LineItem.strictFindActiveById(id);
      doc.setUserContext(auth.user);
      doc.set({
        dates: {
          type: 'days',
          days,
          start: undefined,
          end: undefined,
        },
      });
      return handleValidation(doc);
    },

    lineitemDateRange: async (_, { input }, { auth }) => {
      const { id, start, end } = input;
      const doc = await LineItem.strictFindActiveById(id);
      doc.setUserContext(auth.user);
      doc.set({
        dates: {
          type: 'range',
          days: undefined,
          start,
          end,
        },
      });
      return handleValidation(doc);
    },
  },
};
