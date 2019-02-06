import Joi from 'joi';

export default (data, schema, options = { allowUnknown: true, stripUnknown: true }) => {
  const { error, value } = Joi.validate(data, schema, options);
  if (error) {
    const err = new Error(error.details[0].message);
    err.status = 400;
    throw err;
  }
  return { error, value };
};
