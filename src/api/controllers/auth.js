import bcrypt from '../../helpers/bcrypt';
import db from '../../db';
import { validateLoginBody, validateTokenBody } from '../validations/auths';
import { serializeUser } from '../serailizer/users';
import { generateAuthToken, verifyAuthToken } from '../../helpers/token';
import { InvalidExceptions } from '../../helpers/exceptions';

export const login = async (req, res, next) => {
  const { email, password } = validateLoginBody(req.body);

  const user = await Promise.resolve(db.User.findByEmail(email));
  if (!user) return next(new InvalidExceptions('Invalid email or password.'));

  const validPassword = await bcrypt.compare(password, user.password);

  if (!validPassword) return next(new InvalidExceptions('Invalid email or password.'));

  const token = generateAuthToken(user);
  const serialized = serializeUser(user);
  res.send({ user: { ...serialized }, token });
};

export const logout = async (req, res) => {
  res.send(true);
};

export const refresh = async (req, res, next) => {
  const { token: currentToken } = validateTokenBody(req.body);

  let user = verifyAuthToken(currentToken);
  user = await Promise.resolve(db.User.findById(user.id));
  if (!user) return next(new InvalidExceptions('Invalid token.'));

  const token = generateAuthToken(user);
  const serialized = serializeUser(user);
  res.send({ user: { ...serialized }, token });
};

export const verify = async (req, res, next) => {
  const { token } = validateTokenBody(req.body);

  let user = verifyAuthToken(token);
  user = await Promise.resolve(db.User.findById(user.id));
  if (!user) return next(new InvalidExceptions('Invalid token.'));

  const serialized = serializeUser(user);
  res.send({ user: { ...serialized }, token });
};
