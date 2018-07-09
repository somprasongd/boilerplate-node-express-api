import logging from './logging';
import config from './config';
import db from './db';
import middlewares from './middlewares';
import routes from './routes';

export default app => {
  logging(app); // setup winston log
  config(); // validate config
  db(); // connect to db
  middlewares(app); // handle middlewares
  routes(app); // handle routes
};
