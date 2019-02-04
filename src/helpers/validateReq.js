import Joi from 'joi';

export default (data, schema, options = { allowUnknown: false, stripUnknown: true }) => next => {
  const { error, value } = Joi.validate(data, schema, options);
  if (error && next) {
    const err = new Error(error.details[0].message);
    err.status = 400;
    return next(err);
  }
  return { error, value };
};
