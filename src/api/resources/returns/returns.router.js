import express from 'express';
import Joi from 'joi';
import * as controller from './returns.controller';
import auth from '../../middlewares/auth';
import validate from '../../middlewares/validate';

export const router = express.Router();

// Example use validate req.body with middleware
router.post('/', [auth, validate(validateReturn)], controller.returnMovie);

function validateReturn(req) {
  const schema = {
    customerId: Joi.objectId().required(), // Joi.objectId() created in api/index.js
    movieId: Joi.objectId().required(),
  };

  return Joi.validate(req, schema);
}
