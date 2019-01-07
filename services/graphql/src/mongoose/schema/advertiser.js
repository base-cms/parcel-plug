const { Schema } = require('mongoose');
const { isURL } = require('validator');
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
  website: {
    type: String,
    trim: true,
    validate: {
      validator(v) {
        if (!v) return true;
        return isURL(v, {
          protocols: ['http', 'https'],
          require_protocol: true,
        });
      },
      message: 'Invalid publisher website URL for {VALUE}',
    },
  },
}, { timestamps: true });

schema.plugin(deleteablePlugin);
schema.plugin(repositoryPlugin);
schema.plugin(paginablePlugin, {
  collateWhen: ['name'],
});
schema.plugin(userAttributionPlugin);

module.exports = schema;
