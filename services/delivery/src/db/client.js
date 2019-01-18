const { ObjectId } = require('mongodb');

class DB {
  /**
   *
   * @param {object} params
   */
  constructor({ mongodb }) {
    this.mongodb = mongodb;
  }

  /**
   *
   */
  connect() {
    return this.mongodb.connect();
  }

  /**
   * @param {boolean} [force]
   */
  close(force) {
    return this.mongodb.close(force);
  }

  /**
   * @param {string} [name]
   */
  db(name) {
    return this.mongodb.db(name);
  }

  /**
   *
   * @param {string} name
   */
  collection(name) {
    return this.db().collection(name);
  }

  /**
   * Finds a single document for the provided resource and ID.
   *
   * @param {string} resource The resource name, e.g. `adunits`.
   * @param {*} id The model identifier.
   * @param {object} [options] Options to pass to `Collection.findOne`.
   * @return {Promise<object|null>}
   */
  async findById(resource, id, options) {
    if (!id) return null;
    return this.findOne(resource, { _id: DB.coerceId(id) }, options);
  }

  /**
   * Finds a single document for the provided resource and ID.
   * Will throw an error if the document is not found.
   *
   * @param {string} resource The resource name, e.g. `adunits`.
   * @param {*} id The model identifier.
   * @param {object} [options] Options to pass to `Collection.findOne`.
   * @return {Promise<object|null>}
   */
  async strictFindById(resource, id, options) {
    const doc = await this.findById(resource, id, options);
    if (!doc) throw DB.error(`No record found for ID ${id} in ${resource}`, 404);
    return doc;
  }

  /**
   * Finds a single document for the provided resource and ID, where active.
   * Will throw an error if the document is not found.
   *
   * @param {string} resource The resource name, e.g. `adunits`.
   * @param {*} id The model identifier.
   * @param {object} [options] Options to pass to `Collection.findOne`.
   * @return {Promise<object|null>}
   */
  strictFindActiveById(resource, id, options) {
    const query = { _id: DB.coerceId(id), deleted: false };
    return this.strictFindOne(resource, query, options);
  }

  /**
   * Finds a single document for the provided resource and (optional) query criteria.
   *
   * @param {string} resource The resource name, e.g. `adunits`.
   * @param {object} [query] The query criteria.
   * @param {object} [options] Options to pass to `Collection.findOne`.
   * @return {Promise<object|null>}
   */
  async findOne(resource, query, options) {
    const coll = await this.collection(resource);
    const doc = await coll.findOne(query, options);
    return doc;
  }

  /**
   * Finds a single document for the provided resource and (optional) query criteria.
   * Will throw an error if the document is not found.
   *
   * @param {string} resource The resource, e.g. `adunits`.
   * @param {object} [query] The query criteria.
   * @param {object} [options] Options to pass to `Collection.findOne`.
   * @return {Promise<object|null>}
   */
  async strictFindOne(resource, query, options) {
    const doc = await this.findOne(resource, query, options);
    if (!doc) throw DB.error(`No record found for query ${JSON.stringify(query)} in ${resource}`, 404);
    return doc;
  }

  /**
   *
   * @param {string} id
   */
  ping(id) {
    const { mongodb } = this;
    const args = [{ _id: id }, { $set: { last: new Date() } }, { upsert: true }];
    return Promise.all([
      mongodb.db().command({ ping: 1 }),
      mongodb.db().collection('pings').updateOne(...args),
    ]);
  }

  /**
   *
   * @param {*} id
   */
  static coerceId(id) {
    if (typeof id !== 'string') return id;
    return /^[a-f0-9]{24}$/.test(id) ? new ObjectId(id) : id;
  }

  /**
   * Creates a new `Error` object with the provided message and status code.
   *
   * @param {string} message
   * @param {number} statusCode
   */
  static error(message, statusCode) {
    const err = new Error(message);
    err.statusCode = Number(statusCode);
    return err;
  }
}

module.exports = DB;
