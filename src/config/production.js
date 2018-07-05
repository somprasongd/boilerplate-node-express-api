const whitelist = ['http://example1.com', 'http://example2.com'];

module.exports = {
  port: 80,
  corsOptions: {
    origin: function (origin, callback) {
      if (whitelist.indexOf(origin) !== -1) {
        callback(null, true)
      } else {
        callback(new Error('Not allowed by CORS'))
      }
    }
  },
}