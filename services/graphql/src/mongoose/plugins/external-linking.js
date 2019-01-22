const { Schema } = require('mongoose');
const { isURL } = require('validator');

const LinkSchema = new Schema({
  url: {
    type: String,
    required: true,
    trim: true,
    validate: {
      validator(v) {
        if (!v) return false;
        return isURL(v, {
          protocols: ['http', 'https'],
          require_protocol: true,
        });
      },
      message: 'Invalid URL for {VALUE}',
    },
  },
  label: {
    type: String,
    required: false,
    trim: true,
  },
});

module.exports = function externalLinkingPlugin(schema) {
  schema.add({
    externalLinks: [LinkSchema],
  });
};
