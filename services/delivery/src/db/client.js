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
}

module.exports = DB;
