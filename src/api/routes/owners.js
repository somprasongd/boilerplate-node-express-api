import express from 'express';
import * as controller from '../controllers/owners';
import auth from '../middlewares/auth';
import paginate from '../middlewares/paginate';
import validateObjectId from '../middlewares/validateObjectId';

export const router = express.Router();

router
  .route('/')
  .post(auth, controller.create)
  .get([auth, paginate], controller.findAll);

router
  .route('/:id')
  .get([auth, validateObjectId], controller.findOne)
  .delete([auth, validateObjectId], controller.remove)
  .put([auth, validateObjectId], controller.update);
