const DataLoader = require('dataloader');
const models = require('../mongoose/models');

const reduceAndMap = ({ ids, docs, field = 'id' }) => {
  const mapped = docs.reduce((map, doc) => {
    const id = doc.get(field);
    map.set(`${id}`, doc);
    return map;
  }, new Map());
  return ids.map(id => (mapped.get(`${id}`) || null));
};

const createBatchFn = Model => async (ids) => {
  const docs = await Model.find({ _id: { $in: ids } });
  return reduceAndMap({ ids, docs });
};

module.exports = {
  createLoaders: () => Object.keys(models).reduce((obj, k) => {
    const Model = models[k];
    const loader = new DataLoader(keys => createBatchFn(Model)(keys));
    return { ...obj, [k]: loader };
  }, {}),
};
