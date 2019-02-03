// "APPNAME_CORS_WHITELIST": "http://www.example.com,http://www.example2.com"
const whitelist = process.env.APPNAME_CORS_WHITELIST ? process.env.APPNAME_CORS_WHITELIST.split(',') : [];

const CORS_OPTIONS = { origin: '*' };
if (whitelist.length > 0) {
  CORS_OPTIONS.origin = (origin, callback) => {
    // !origin: unblock REST tools or server-to-server requests
    if (whitelist.indexOf(origin) !== -1) {
      callback(null, true);
    } else {
      callback(new Error('Not allowed by CORS'));
    }
  };
}

const config = {
  PORT: process.env.APPNAME_PORT || 3000,
  PAGE_LIMIT: process.env.APPNAME_PAGE_LIMIT || 10,
  // connect to db:
  // postgres: 'postgres://user:password@host:port/db_name'
  // mongo: 'mongodb://user:password@host:port/db_name'
  DB_URI: process.env.APPNAME_DB_URI,
  JWT_SECRET: process.env.APPNAME_JWT_SECRET,
  CORS_OPTIONS,
};

export default config;

export const validateConfig = () => {
  if (!config.DB_URI) {
    throw new Error('FATAL ERROR: DB_URI is not defined.');
  }
  if (!config.JWT_SECRET) {
    throw new Error('FATAL ERROR: JWT_SECRET is not defined.');
  }
};
