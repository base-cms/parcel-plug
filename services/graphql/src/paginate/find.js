const { createResponse, createQuery } = require('./utils');
const Limit = require('./limit');
const Sort = require('./sort');

const { isArray } = Array;

/**
 * @param {object} Model
 * @param {object} params
 * @param {object} [params.query]
 * @param {number} [params.limit=10]
 * @param {object} params.sort
 * @param {string} [params.sort.field=_id]
 * @param {number|string} [params.sort.order=1]
 * @param {object} [params.sort.options]
 */
module.exports = async (Model, {
  query,
  limit = 10,
  after,
  sort = { field: '_id', order: 1 },
  projection,
  excludeProjection,
  collate = false,
}) => {
  const $limit = new Limit({ value: limit });
  const $sort = new Sort(sort);
  const $projection = projection && typeof projection === 'object' ? {
    ...projection,
    _id: 1,
    [$sort.field]: 1,
  } : undefined;
  if ($projection && isArray(excludeProjection)) {
    excludeProjection.forEach(key => delete $projection[key]);
  }

  const params = {
    query,
    sort: $sort,
    limit: $limit,
    after,
  };

  const paginatedQuery = await createQuery(Model, params);
  const $query = { $and: [paginatedQuery, query] };

  const options = {
    sort: $sort.value,
    limit: $limit.value + 1, // peek to see if there is another page.
  };
  if (collate) options.collation = $sort.collation;

  const results = await Model.find($query, $projection, options);

  return createResponse(Model, results, params);
};
