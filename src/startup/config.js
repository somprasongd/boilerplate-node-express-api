import config from '../config';

export default () => {
  if (!config.DB_URI) {
    throw new Error('FATAL ERROR: DB_URI is not defined.');
  }
  if (!config.JWT_SECRET) {
    throw new Error('FATAL ERROR: JWT_SECRET is not defined.');
  }
};
