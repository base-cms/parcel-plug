const mongodb = require('../mongodb');
const DB = require('./client');

module.exports = new DB({ mongodb });
