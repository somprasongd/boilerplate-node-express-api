import express from 'express';
import controller from './customers.controller';
import validateObjectId from '../../middleware/validateObjectId';
import auth from '../../middleware/auth';

export const router = express.Router();

router
  .route('/')
  .post(auth, controller.create)
  .get(auth, controller.findAll);

router
  .route('/:id')
  .get([auth, validateObjectId], controller.findOne)
  .delete(auth, controller.remove)
  .put(auth, controller.update);