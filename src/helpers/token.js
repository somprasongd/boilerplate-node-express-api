import jwt from 'jsonwebtoken';
import config from '../config';

export const generateAuthToken = user => jwt.sign({ id: user.id, isAdmin: user.isAdmin }, config.api.jwtSecretKey);

export const verifyAuthToken = token => jwt.verify(token, config.api.jwtSecretKey);
