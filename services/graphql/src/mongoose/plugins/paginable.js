const paginateFind = require('../../paginate/find');

module.exports = function paginablePlugin(schema) {
  schema.static('paginate', function paginate({
    query,
    limit,
    after,
    sort,
    collate,
    projection,
    excludeProjection,
  }) {
    return paginateFind(this, {
      query,
      limit,
      after,
      sort,
      collate,
      projection,
      excludeProjection,
    });
  });
};
