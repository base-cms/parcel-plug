module.exports = function repositoryPlugin(schema) {
  schema.static('strictFindById', async function strictFindById(id, fields) {
    const doc = await this.findById(id, fields);
    if (!doc) throw new Error(`No ${this.modelName} found for ID '${id}'`);
    return doc;
  });

  schema.static('strictFindOne', async function strictFindOne(criteria, fields) {
    const doc = await this.findOne(criteria, fields);
    if (!doc) throw new Error(`No ${this.modelName} found for criteria '${JSON.stringify(criteria)}'`);
    return doc;
  });

  schema.static('findAndSetUpdate', async function findAndSetUpdate(id, payload) {
    const doc = await this.findById(id);
    if (!doc) throw new Error(`Unable to update ${this.modelName}: no record was found for ID '${id}'`);
    return doc.setUpdate(payload);
  });

  schema.method('setUpdate', async function setUpdate(payload) {
    this.set(payload);
    return this.save();
  });

  schema.static('findAndAssignUpdate', async function findAndAssignUpdate(id, payload) {
    const doc = await this.findById(id);
    if (!doc) throw new Error(`Unable to update ${this.modelName}: no record was found for ID '${id}'`);
    return doc.assignUpdate(payload);
  });

  schema.static('findAndAssignValue', async function findAndAssignValue(id, field, value) {
    const doc = await this.findById(id);
    if (!doc) throw new Error(`Unable to assign field '${field}' to ${this.modelName}: no record was found for id '${id}'`);
    doc.set(field, value);
    return doc.save();
  });

  schema.method('assignUpdate', async function assignUpdate(payload) {
    Object.keys(payload).forEach((key) => {
      const value = payload[key];
      if (typeof value !== 'undefined') {
        this.set(key, value === null ? undefined : value);
      }
    });
    return this.save();
  });
};
