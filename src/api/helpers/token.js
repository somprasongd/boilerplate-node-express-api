import jwt from 'jsonwebtoken';
import config from '../../config';

export const generateAuthToken = user => jwt.sign({ id: user.id, isAdmin: user.isAdmin }, config.JWT_SECRET);

export const verifyAuthToken = token => jwt.verify(token, config.JWT_SECRET);
