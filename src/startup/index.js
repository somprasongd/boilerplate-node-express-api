import logging from './logging';
import config from './config';
import db from './db';
import middlewares from './middlewares';
import routes from './routes';

export default (app) => {
  logging(app);
  config();
  db();
  middlewares(app);
  routes(app);
}