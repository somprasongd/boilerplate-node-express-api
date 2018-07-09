process.env.NODE_CONFIG_DIR = __dirname;
require('dotenv').config();
const config = require('config');

module.exports = { ...config };
