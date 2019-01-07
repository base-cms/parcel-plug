const { Schema } = require('mongoose');
const {
  deleteablePlugin,
  paginablePlugin,
  repositoryPlugin,
  userAttributionPlugin,
} = require('../plugins');

const schema = new Schema({
  name: {
    type: String,
    required: true,
    trim: true,
  },
}, { timestamps: true });

schema.plugin(deleteablePlugin);
schema.plugin(repositoryPlugin);
schema.plugin(paginablePlugin, {
  collateWhen: ['name'],
});
schema.plugin(userAttributionPlugin);

module.exports = schema;
