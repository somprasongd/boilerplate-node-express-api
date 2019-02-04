import express from 'express';
import Joi from 'joi';
import * as controller from '../controllers/pets';
import admin from '../middlewares/admin';
import auth from '../middlewares/auth'; // use for auth with JWT
import parsePage from '../middlewares/parsePage'; // use for paginations
import validateObjectId from '../middlewares/validateObjectId'; // use for validate id format

export const router = express.Router();

router
  .route('/')
  .post([auth], controller.create)
  .get(parsePage, controller.findAll);

router
  .route('/:id')
  .get([auth, validateObjectId], controller.findOne)
  .delete([auth, admin, validateObjectId], controller.remove)
  .put([auth, validateObjectId], controller.update);

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
