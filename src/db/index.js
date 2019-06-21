import config from '../config';
import logger from '../logger';
import startupEvents from '../helpers/startup-events';
import Pet from './models/pet';
import User from './models/user';

// add connection code here
// connect with config.DB_URI
const db = { Pet, User };

const testConnection = () => {
  // log status with winston
  setTimeout(() => {
    logger.info(`db connected to ${config.db.uri}`);
    startupEvents.emit('db-connected');
  }, 500);
};

export default db;

export { testConnection };
