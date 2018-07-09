import express from 'express';
import Joi from 'joi';
import * as controller from '../controllers/pets';
import auth from '../middlewares/auth'; // use for auth with JWT
import paginate from '../middlewares/paginate'; // use for paginations
import validate from '../middlewares/validate'; // use for need to validate body
import validateObjectId from '../middlewares/validateObjectId'; // use for validate id format

export const router = express.Router();

router
  .route('/')
  .post([auth, validate(validateBody)], controller.create)
  .get(paginate, controller.findAll);

router
  .route('/:id')
  .get([auth, validateObjectId], controller.findOne)
  .delete([auth, validateObjectId], controller.delete)
  .put([[auth, validate(validateBody)], validateObjectId], controller.update);

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
