import { verifyAuthToken } from '../helpers/token';

export default (req, res, next) => {
  const token = req.header('x-auth-token');
  if (!token) return res.status(401).json({ error: { message: 'Access denied. No token provided.' } });

  try {
    const decoded = verifyAuthToken(token);
    req.user = decoded;
    next();
  } catch (ex) {
    res.status(401).json({ error: { message: 'Invalid token.' } });
  }
};

export const isAdmin = (req, res, next) => {
  // 403 Forbidden
  if (!req.user.isAdmin) return res.status(403).json({ error: { message: 'Access denied.' } });
  next();
};
