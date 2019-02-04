import Joi from 'joi';

const envVarsSchema = Joi.object({
  APPNAME_PAGE_LIMIT: Joi.number().default(10),
  APPNAME_JWT_SECRET: Joi.string().required(),
})
  .unknown()
  .required();

const { error, value: envVars } = Joi.validate(process.env, envVarsSchema);
if (error) {
  throw new Error(`Config validation error: ${error.message}`);
}

const config = {
  api: {
    pageLimit: envVars.APPNAME_PAGE_LIMIT,
    jwtSecretKey: envVars.APPNAME_JWT_SECRET,
  },
};

module.exports = config;
