import express from 'express';
import * as controller from './rentals.controller';
import auth from '../../middlewares/auth';

export const router = express.Router();

router
  .route('/')
  .post(auth, controller.create)
  .get(auth, controller.findAll);

router.route(auth, '/:id');
