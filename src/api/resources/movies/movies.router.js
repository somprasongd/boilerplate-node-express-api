import express from 'express';
import * as controller from './movies.controller';
import validateObjectId from '../../middlewares/validateObjectId';
import auth from '../../middlewares/auth';

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
