import Joi from 'joi';

const envVarsSchema = Joi.object({
  APPNAME_SENTRY_DNS: Joi.string(),
})
  .unknown()
  .required();

const { error, value: envVars } = Joi.validate(process.env, envVarsSchema);
if (error) {
  throw new Error(`Config validation error: ${error.message}`);
}

const config = {
  sentry: {
    dns: envVars.APPNAME_SENTRY_DNS,
  },
};

module.exports = config;
