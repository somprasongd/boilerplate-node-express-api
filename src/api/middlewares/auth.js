import jwt from 'jsonwebtoken';
import config from '../../config';

export default (req, res, next) => {
  const token = req.header('x-auth-token');
  if (!token) return res.status(401).json({ error: { message: 'Access denied. No token provided.' } });

  try {
    const decoded = jwt.verify(token, config.JWT_SECRET);
    req.user = decoded;
    next();
  } catch (ex) {
    res.status(400).json({ error: { message: 'Invalid token.' } });
  }
};
