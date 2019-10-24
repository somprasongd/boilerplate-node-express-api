import { verifyAuthToken } from '../../../helpers/token';
import { UnauthorizedExceptions, PermissionExceptions, InvalidExceptions } from '../../../helpers/exceptions';

export const isAuthen = (req, res, next) => {
  const token = req.header('x-auth-token');
  if (!token) return next(new UnauthorizedExceptions('Access denied. No token provided.'));

  try {
    const decoded = verifyAuthToken(token);
    req.user = decoded;
    next();
  } catch (ex) {
    next(new InvalidExceptions('Invalid token.'));
  }
};

export const isAdmin = (req, res, next) => {
  if (!req.user.isAdmin)
    return next(new PermissionExceptions('Access Denied: You are not authorized to perform this action.'));
  next();
};
