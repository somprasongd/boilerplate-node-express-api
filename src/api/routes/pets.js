import express from 'express';
import * as controller from '../controllers/pets';
import auth from '../middlewares/auth'; // use for auth with JWT
import paginate from '../middlewares/paginate'; // use for paginations
import validateObjectId from '../middlewares/validateObjectId'; // use for validate id format

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
