const cursor = require('./cursor');

module.exports = {
  /**
   *
   * @param {object} Model
   * @param {array} results
   * @param {object} params
   * @param {object} [params.query]
   */
  createResponse(Model, results, {
    query,
    limit,
  } = {}) {
    const hasNextPage = results.length > limit.value;
    // Remove the extra model that was queried to peek for the page.
    if (hasNextPage) results.pop();

    // Cursor generation is actually pretty slow... 5 - 20ms on large datasets.
    // As such, only return the values if requested (by making the property a function).
    const pageInfo = {
      hasNextPage,
      endCursor: () => (hasNextPage ? cursor.encode(results[results.length - 1]._id) : null),
    };
    return {
      edges: () => results.map(node => ({ node, cursor: () => cursor.encode(node._id) })),
      pageInfo,
      totalCount: () => Model.countDocuments(query),
    };
  },

  /**
   *
   */
  createEmptyResponse() {
    const pageInfo = {
      hasNextPage: false,
      endCursor: null,
    };
    return {
      edges: [],
      pageInfo,
      totalCount: () => 0,
    };
  },

  /**
   * @param {object} Model
   * @param {object} params
   * @param {string} [params.after] The cursor value to start the next page.
   * @param {object} params.sort The sort field and order object.
   */
  async createQuery(Model, {
    after,
    sort,
  } = {}) {
    if (!after) return {};
    const id = cursor.decode(after);
    const { field, order } = sort;
    const op = order === 1 ? '$gt' : '$lt';

    if (field === '_id') {
      // Simple sort by id.
      return { _id: { [op]: id } };
    }

    // Compound sort.
    // Need to get the document so we can extract the field.
    // If the field contains an array position using dot notation, must use slice.
    // @see https://jira.mongodb.org/browse/SERVER-1831
    const pattern = /(^.+)(\.)(\d)/;
    const matches = pattern.exec(field);
    const projection = {};
    if (matches && matches[1] && matches[3]) {
      projection[matches[1]] = { $slice: [Number(matches[3]), 1] };
    } else {
      projection[field] = 1;
    }

    const doc = await Model.findById(id, projection);
    const value = doc.get(field);
    const $or = [
      { [field]: { [op]: value } },
      { [field]: { $eq: value }, _id: { [op]: id } },
    ];
    return { $or };
  },
};
