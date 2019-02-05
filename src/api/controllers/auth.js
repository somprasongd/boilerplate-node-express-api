import Joi from 'joi';
import bcrypt from '../../helpers/bcrypt';
import User from '../../db/models/user';
import validateReqData from '../../helpers/validateReqData';
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
  const { value } = validateReqData(req.body, schema);

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
