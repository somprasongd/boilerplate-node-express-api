import express from 'express';
import controller from './genres.controller';
import validateObjectId from '../../middleware/validateObjectId';
import auth from '../../middleware/auth';
import admin from '../../middlewares/admin';

export const router = express.Router();

router
  .route('/')
  .post(auth, controller.create)
  .get(controller.findAll);

router
  .route('/:id')
  .get(validateObjectId, controller.findOne)
  .delete([auth, admin, validateObjectId], controller.remove)
  .put([auth, validateObjectId], controller.update);