import express from 'express';
import * as controller from './auth.controller';

export const router = express.Router();

router.post('/login', controller.login);
router.post('/logout', controller.logout);
