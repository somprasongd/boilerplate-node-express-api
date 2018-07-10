import jwt from 'jsonwebtoken';
import config from '../../config';

export default (req, res, next) => {
  const token = req.header('x-auth-token');

  if (!token) return res.status(401).send('Access denied. No token provided.');

  try {
    const decoded = jwt.verify(token, config.JWT_SECRET);
    req.user = decoded;
    next();
  } catch (ex) {
    res.status(400).send('Invalid token.');
  }
};
