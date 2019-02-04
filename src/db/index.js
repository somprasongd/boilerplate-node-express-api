// import package here
import winston from 'winston';
import config from '../config';
import startupEvents from '../helpers/startup-events';

let db;

const createConnection = () => {
  // add connection code here
  // connect to config.DB_URI
  // log status with winston
  setTimeout(() => {
    db = {};
    winston.info(`db connected to ${config.db.uri}`);
    startupEvents.emit('db-connected');
  }, 500);
};

export default { ...db };

export { createConnection };
