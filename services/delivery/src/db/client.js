const { ObjectId } = require('mongodb');
const httpError = require('../utils/http-error');

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
   * Aggregates document for the provided resource and pipeline.
   *
   * @param {string} resource The resource, e.g. `adunits`.
   * @param {object} pipeline The aggregation pipeline.
   * @param {object} [options] Options to pass to `Collection.aggregate`.
   * @return {Promise<object|null>}
   */
  async aggregate(resource, pipeline, options) {
    const coll = await this.collection(resource);
    return coll.aggregate(pipeline, options);
  }

  /**
   * Inserts a single document for the provided resource.
   *
   * @param {string} resource The resource, e.g. `adunits`.
   * @param {object} doc The document to insert
   * @param {object} [options] Options to pass to `Collection.insertOne`.
   * @return {Promise<object|null>}
   */
  async insertOne(resource, doc, options) {
    const coll = await this.collection(resource);
    return coll.insertOne(doc, options);
  }

  /**
   * Updates a single document for the provided resource.
   *
   * @param {string} resource The resource, e.g. `adunits`.
   * @param {object} filter The query used to select the document to update.
   * @param {object} update The update operations to be applied to the document.
   * @param {object} [options] Options to pass to `Collection.updateOne`.
   * @return {Promise<object|null>}
   */
  async updateOne(resource, filter, update, options) {
    const coll = await this.collection(resource);
    return coll.updateOne(filter, update, options);
  }

  /**
   * Updates a multiple documents for the provided resource.
   *
   * @param {string} resource The resource, e.g. `adunits`.
   * @param {object} filter The query used to select the documents to update.
   * @param {object} update The update operations to be applied to the documents.
   * @param {object} [options] Options to pass to `Collection.updateOne`.
   * @return {Promise<object|null>}
   */
  async updateMany(resource, filter, update, options) {
    const coll = await this.collection(resource);
    return coll.updateOne(filter, update, options);
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
    return httpError(statusCode, message);
  }
}

module.exports = DB;
