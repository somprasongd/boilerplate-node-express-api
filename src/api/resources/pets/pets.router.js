import express from 'express';
import controller from './pets.controller';

export const router = express.Router();

router
  .route('/')
  .post(controller.create)
  .get(controller.findAll);

router
  .route('/:id')
  .get(controller.findOne)
  .delete(controller.delete)
  .put(controller.update);