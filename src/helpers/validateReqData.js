import Joi from 'joi';
import { invalidExceptionHandler } from './exceptionHandler';

const defaultOptions = {
  allowUnknown: true,
  stripUnknown: true,
  abortEarly: false,
};

export default (data, schema, options = defaultOptions) => {
  const { error, value } = Joi.validate(data, schema, options);

  if (!error) return value;

  const message = error.details.reduce((acc, curr) => `${acc}${acc ? ', ' : ''}${curr.message}`, '');

  invalidExceptionHandler(message);
};
