import express from 'express';
import * as controller from '../controllers/users';
import auth from '../middlewares/auth';

export const router = express.Router();

router.post('/', controller.signup);
router.get('/me', auth, controller.findMe);
