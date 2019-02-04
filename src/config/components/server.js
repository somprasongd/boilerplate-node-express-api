import Joi from 'joi';

const envVarsSchema = Joi.object({
  APPNAME_PORT: Joi.number().default(3000),
  APPNAME_GRACEFUL_SHUTDOWN_TIMEOUT: Joi.number().default(30000),
  APPNAME_CORS_WHITELIST: Joi.string(),
})
  .unknown()
  .required();

const { error, value: envVars } = Joi.validate(process.env, envVarsSchema);
if (error) {
  throw new Error(`Config validation error: ${error.message}`);
}

// "APPNAME_CORS_WHITELIST": "http://www.example.com,http://www.example2.com"
const whitelist = envVars.APPNAME_CORS_WHITELIST ? envVars.APPNAME_CORS_WHITELIST.split(',') : [];

const corsOptions = { origin: '*' };
if (whitelist.length > 0) {
  corsOptions.origin = (origin, callback) => {
    // !origin: unblock REST tools or server-to-server requests
    if (whitelist.indexOf(origin) !== -1 || !origin) {
      callback(null, true);
    } else {
      callback(new Error('Not allowed by CORS'));
    }
  };
}

const config = {
  server: {
    port: envVars.APPNAME_PORT,
    gracefulShutdownTimeout: envVars.APPNAME_GRACEFUL_SHUTDOWN_TIMEOUT,
    corsOptions,
  },
};

module.exports = config;
