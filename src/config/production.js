import dotenv from 'dotenv';

// read environtment variables from .env file to process.env
dotenv.config();

const whitelist = ['http://example1.com', 'http://example2.com'];

export default {
  PORT: process.env.appName_PORT || 3000,
  DB_URI: process.env.appName_DB_URI,
  JWT_SECRET: process.env.appName_JWT_SECRET,
  CORS_OPTIONS: {
    origin(origin, callback) {
      if (whitelist.indexOf(origin) !== -1) {
        callback(null, true);
      } else {
        callback(new Error('Not allowed by CORS'));
      }
    },
  },
};
