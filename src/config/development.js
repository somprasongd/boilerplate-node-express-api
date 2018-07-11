export default {
  PORT: 3000,
  PAGE_LIMIT: 10,
  // connect to mongodb
  DB_URI: 'mongodb://username:password@host:port/database',
  // or connect to postgresql
  // DB_URL: 'postgres://username:password@host:port/database',
  JWT_SECRET: 'demo_jwt_secret_key',
  CORS_OPTIONS: { origin: '*' },
};
