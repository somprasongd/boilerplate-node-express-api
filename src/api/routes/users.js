import express from 'express';
import * as controller from '../controllers/users';
import validateReq from '../middlewares/validate-req';

const { auth } = validateReq;

export const router = express.Router();

router.post('/', controller.createUser);
router.get('/me', auth.isAuthen, controller.findMe);
