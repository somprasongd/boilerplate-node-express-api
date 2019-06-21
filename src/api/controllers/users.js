import bcrypt from '../../helpers/bcrypt';
import { generateAuthToken } from '../../helpers/token';
import { invalidExceptionHandler, notFoundExceptionHandler } from '../../helpers/exceptionHandler';
import db from '../../db';
import { validateCreateUser } from '../validations/users';
import { serializeUser } from '../serailizer/users';

export const createUser = async (req, res) => {
  const { name, email, password, isAdmin } = validateCreateUser(req.body);

  let user = await db.User.findByEmail({ email });

  if (user) return invalidExceptionHandler('User already registered.');

  user = new db.User(name, email, password, isAdmin);

  user.password = await bcrypt.hash(password);
  user = await Promise.resolve(user.create());

  const token = generateAuthToken(user);
  const serialized = serializeUser(user);
  res.send({ user: { ...serialized }, token });
};

export const findMe = async (req, res) => {
  const user = await Promise.resolve(db.User.findById(req.user.id));

  if (!user) return notFoundExceptionHandler('The user with the given ID was not found.');

  const serialized = serializeUser(user);
  res.send(serialized);
};
