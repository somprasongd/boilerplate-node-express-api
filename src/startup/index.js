import logging from './logging';
import config from './config';
import middlewares from './middlewares';
import routes from './routes';

export default app => {
  logging(app); // setup winston log
  config(); // validate config
  // Note: move db to each controller
  middlewares(app); // handle middlewares
  routes(app); // handle routes
};
