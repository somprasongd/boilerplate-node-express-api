import express from 'express';
import * as controller from './users.controller';
import auth from '../../middlewares/auth';

export const router = express.Router();

router.post('/', auth, controller.create);
router.get('/me', auth, controller.findOne);
