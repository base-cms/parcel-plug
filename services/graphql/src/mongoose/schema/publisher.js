const { Schema } = require('mongoose');

const schema = new Schema({
  name: {
    type: String,
    required: true,
    trim: true,
  },
});

module.exports = schema;
