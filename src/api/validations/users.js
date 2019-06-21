import Joi from 'joi';
import validateReqData from '../../helpers/validateReqData';

export const validateCreateUser = data => {
  const schema = {
    name: Joi.string()
      .min(5)
      .max(50)
      .required(),
    email: Joi.string()
      .min(5)
      .max(255)
      .required()
      .email(),
    password: Joi.string()
      .min(5)
      .max(255)
      .required(),
    isAdmin: Joi.boolean().default(false),
  };

  return validateReqData(data, schema);
};
