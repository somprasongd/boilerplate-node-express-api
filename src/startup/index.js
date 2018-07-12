import logging from './logging';
import config from './config';
import * as db from '../config/db';
import middlewares from './middlewares';
import routes from './routes';

export default app => {
  logging(app); // setup winston log
  config(); // validate config
  db.testConnection(); // test connection on startup
  middlewares(app); // handle middlewares
  routes(app); // handle routes
};
