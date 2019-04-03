// eslint-disable-next-line no-unused-vars
import _ from './components/dotenv';
import api from './components/api';
import common from './components/common';
import database from './components/database';
import server from './components/server';

// use Joi in each components
// ['APPNAME_DB_URI', 'APPNAME_JWT_SECRET'].forEach(name => {
//   if (!process.env[name]) {
//     throw new Error(`FATAL ERROR: Environment variable ${name} is missing`);
//   }
// });

const config = {
  ...api,
  ...common,
  ...database,
  ...server,
};

export default config;
