import Joi from 'joi';

export default {
  validateBody(body) {
    const schema = Joi.object().keys({
      name: Joi.string().required(),
      category: Joi.string().required(),
      breed: Joi.string().required(),
      tags: Joi.array(),
      age: Joi.string().required(),
      isAlive: Joi.boolean(),
      isLost: Joi.boolean(),
      prize: Joi.number()
        .integer()
        .min(0)
        .max(200000)
        .optional(),
    });
    const { value, error } = Joi.validate(body, schema);
    if (error && error.details) {
      return { error };
    }
    return { value };
  }
};