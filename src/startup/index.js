import * as logger from '../logger';
import { testConnection } from '../db';
import initMiddlewares from './middlewares';
import initRoutes from './routes';

export default app => {
  logger.init(app); // setup winston log
  testConnection(); // test connect to db
  initMiddlewares(app); // handle middlewares
  initRoutes(app); // handle routes
};
