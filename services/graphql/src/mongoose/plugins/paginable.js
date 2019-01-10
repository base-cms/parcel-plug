const paginateFind = require('../../paginate/find');
const { createEmptyResponse } = require('../../paginate/utils');

module.exports = function paginablePlugin(schema, {
  collateWhen = [],
} = {}) {
  schema.static('paginate', function paginate({
    query,
    limit,
    after,
    sort,
    projection,
    excludeProjection,
  }) {
    return paginateFind(this, {
      query,
      limit,
      after,
      sort,
      collate: collateWhen.includes(sort.field),
      projection,
      excludeProjection,
    });
  });

  schema.static('paginateEmpty', () => createEmptyResponse());
};
