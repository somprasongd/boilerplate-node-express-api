import Joi from 'joi';

const envVarsSchema = Joi.object({
  NODE_ENV: Joi.string().default('development'),
})
  .unknown()
  .when(Joi.object({ NODE_ENV: Joi.exist() }), {
    then: Joi.object({ NODE_ENV: Joi.valid(['development', 'production', 'test', 'provision']) }),
  })
  .required();
const { error, value: envVars } = Joi.validate(process.env, envVarsSchema);
if (error) {
  throw new Error(`Config validation error: ${error.message}`);
}

const config = {
  env: envVars.NODE_ENV,
};

export default config;
