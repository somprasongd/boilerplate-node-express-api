import Joi from 'joi';

export default {
  validateBody(body) {
    const schema = Joi.object().keys({
      name: Joi.string().required(),
      breed: Joi.string().required(),
      age: Joi.number()
        .integer()
        .min(0)
        .max(20)
        .optional(),
    });
    const { value, error } = Joi.validate(body, schema);
    if (error && error.details) {
      return { error };
    }
    return { value };
  }
};