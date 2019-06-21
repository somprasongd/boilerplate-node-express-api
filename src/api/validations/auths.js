import Joi from 'joi';
import validateReqData from '../../helpers/validateReqData';

export const validateLoginBody = data => {
  const schema = {
    email: Joi.string()
      .min(5)
      .max(255)
      .required()
      .email(),
    password: Joi.string()
      .min(5)
      .max(255)
      .required(),
  };

  return validateReqData(data, schema);
};

export const validateTokenBody = data => {
  const schema = {
    token: Joi.string().required(),
  };

  return validateReqData(data, schema);
};
