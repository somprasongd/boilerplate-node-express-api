import express from 'express';
import Joi from 'joi';
import * as controller from '../controllers/pets';
import validateReq from '../middlewares/validate-req';
import parsePage from '../middlewares/parsePage'; // use for paginations

const { auth, isObjectId } = validateReq;

export const router = express.Router();

router
  .route('/')
  .post([auth.isAuthen], controller.create)
  .get(parsePage, controller.findAll);

router
  .route('/:id')
  .get([auth.isAuthen, isObjectId], controller.findOne)
  .delete([auth.isAuthen, auth.isAdmin, isObjectId], controller.remove)
  .put([auth.isAuthen, isObjectId], controller.update);

function validateBody(body) {
  const schema = Joi.object().keys({
    name: Joi.string().required(),
    category: Joi.string().required(),
    breed: Joi.string().required(),
    age: Joi.string().required(),
  });
  const { value, error } = Joi.validate(body, schema);
  if (error && error.details) {
    return { error };
  }
  return { value };
}
