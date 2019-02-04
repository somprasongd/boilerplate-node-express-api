import Joi from 'joi';
import bcrypt from '../../helpers/bcrypt';
import User from '../../db/models/user';
import { generateAuthToken } from '../../helpers/token';

export const login = async (req, res, next) => {
  const schema = {
    email: Joi.string()
      .min(5)
      .max(255)
      .required()
      .email(),
    password: Joi.string()
      .min(5)
      .max(255)
      .required(),
  };
  const { error, value } = Joi.validate(req.body, schema);
  if (error) {
    const err = new Error(error.details[0].message);
    err.status = 400;
    return next(err);
  }

  const { email, password } = value;

  const user = await User.findByEmail(email);
  if (!user) {
    const err = new Error('Invalid email or password.');
    err.status = 400;
    return next(err);
  }

  const validPassword = await bcrypt.compare(password, user.password);

  if (!validPassword) {
    const err = new Error('Invalid email or password.');
    err.status = 400;
    return next(err);
  }

  const token = generateAuthToken(user);
  const { id, name } = user;
  res.send({ id, name, email, token });
};

export const logout = async (req, res) => {
  res.send(true);
};
