import initLogging from '../config/logging';
import { validateConfig } from '../config';
import { createConnection } from '../db';
import initMiddlewares from './middlewares';
import initRoutes from './routes';

export default app => {
  initLogging(app); // setup winston log
  validateConfig(); // validate config
  createConnection(); // connect to db
  initMiddlewares(app); // handle middlewares
  initRoutes(app); // handle routes
};
