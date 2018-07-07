const whitelist = ['http://example1.com', 'http://example2.com'];

module.exports = {
  PORT: process.env.PORT,
  DB_URI: process.env.DB_URI,
  CORS_OPTIONS: {
    origin: function (origin, callback) {
      if (whitelist.indexOf(origin) !== -1) {
        callback(null, true)
      } else {
        callback(new Error('Not allowed by CORS'))
      }
    }
  },
}