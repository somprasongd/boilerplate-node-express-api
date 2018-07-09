import express from 'express';
import * as controller from './genres.controller';
import validateObjectId from '../../middlewares/validateObjectId';
import auth from '../../middlewares/auth';
import admin from '../../middlewares/admin';
import paginate from '../../middlewares/paginate';

export const router = express.Router();

router
  .route('/')
  .post(auth, controller.create)
  .get(paginate, controller.findAll);

router
  .route('/:id')
  .get(validateObjectId, controller.findOne)
  .delete([auth, admin, validateObjectId], controller.remove)
  .put([auth, validateObjectId], controller.update);
