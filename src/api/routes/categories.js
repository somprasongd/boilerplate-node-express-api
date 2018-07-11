import express from 'express';
import * as controller from '../controllers/categories';
import admin from '../middlewares/admin';
import auth from '../middlewares/auth';
import paginate from '../middlewares/paginate';
import validateObjectId from '../middlewares/validateObjectId';

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
