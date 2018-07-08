import express from 'express';
import * as controller from './rentals.controller';
import validateObjectId from '../../middleware/validateObjectId';
import auth from '../../middleware/auth';

export const router = express.Router();

router
  .route('/')
  .post(auth, controller.create)
  .get(auth, controller.findAll);

router
  .route('/:id');