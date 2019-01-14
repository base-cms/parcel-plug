const AdUnit = require('../../mongoose/models/adunit');
const Deployment = require('../../mongoose/models/deployment');
const Publisher = require('../../mongoose/models/publisher');

const isObject = v => v && typeof v === 'object';

const { isArray } = Array;

module.exports = {
  LineItem: {
    criteria: ({ criteria }) => (isObject(criteria) ? criteria : {}),
    dates: ({ dates }) => (isObject(dates) ? dates : {}),
  },

  LineItemCriteria: {
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
};
