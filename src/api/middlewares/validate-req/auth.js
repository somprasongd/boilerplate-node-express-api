import jwt from 'jsonwebtoken';
import config from '../../../config';

export const isAuthen = (req, res, next) => {
  const token = req.header('x-auth-token');
  if (!token) {
    const err = new Error('Access denied. No token provided.');
    err.status = 401; // 401 Unauthorized
    return next(err);
  }

  try {
    const decoded = jwt.verify(token, config.api.jwtSecretKey);
    req.user = decoded;
    next();
  } catch (ex) {
    res.status(400).json({ error: { message: 'Invalid token.' } });
  }
};

export const isAdmin = (req, res, next) => {
  if (!req.user.isAdmin) {
    const err = new Error('Access Denied: You are not authorized to perform this action.');
    err.status = 403; // 403 Forbidden
    return next(err);
  }
  next();
};
