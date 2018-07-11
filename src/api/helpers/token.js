import jwt from 'jsonwebtoken';
import config from '../../config';

export const generateAuthToken = user => {
  const token = jwt.sign({ id: user.id, isAdmin: user.isAdmin }, config.JWT_SECRET);
  return token;
};
