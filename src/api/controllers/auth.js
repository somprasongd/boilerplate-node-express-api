import Joi from 'joi';
import bcrypt from '../../helpers/bcrypt';
import db from '../../db';
import { validateLoginBody, validateTokenBody } from '../validations/auths';
import { serializeUser } from '../serailizer/users';
import { generateAuthToken, verifyAuthToken } from '../../helpers/token';
import { invalidExceptionHandler, notFoundExceptionHandler } from '../../helpers/exceptionHandler';

export const login = async (req, res, next) => {
  const { email, password } = validateLoginBody(req.body);

  const user = await Promise.resolve(db.User.findByEmail(email));
  if (!user) return invalidExceptionHandler('Invalid email or password.');

  const validPassword = await bcrypt.compare(password, user.password);

  if (!validPassword) return invalidExceptionHandler('Invalid email or password.');

  const token = generateAuthToken(user);
  const serialized = serializeUser(user);
  res.send({ user: { ...serialized }, token });
};

export const logout = async (req, res) => {
  res.send(true);
};

export const refresh = async (req, res) => {
  const { token: currentToken } = validateTokenBody(req.body);

  let user = verifyAuthToken(currentToken);
  user = await Promise.resolve(db.User.findById(user.id));
  if (!user) return invalidExceptionHandler('Invalid token.');

  const token = generateAuthToken(user);
  const serialized = serializeUser(user);
  res.send({ user: { ...serialized }, token });
};

export const verify = async (req, res) => {
  const { token } = validateTokenBody(req.body);

  let user = verifyAuthToken(token);
  user = await Promise.resolve(db.User.findById(user.id));
  if (!user) return invalidExceptionHandler('Invalid token.');

  const serialized = serializeUser(user);
  res.send({ user: { ...serialized }, token });
};
