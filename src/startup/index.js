import initLoggger from '../config/logger';
import { createConnection } from '../db';
import initMiddlewares from './middlewares';
import initRoutes from './routes';
import errorHandler from './error';

export default app => {
  initLoggger(app); // setup winston log
  createConnection(); // connect to db
  initMiddlewares(app); // handle middlewares
  initRoutes(app); // handle routes
  errorHandler(app); // handle error
};
