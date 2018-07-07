import logging from './logging';
import db from './db';
import middlewares from './middlewares';
import routes from './routes';

export default (app) => {
  logging(app);
  db();
  middlewares(app);
  routes(app);
}