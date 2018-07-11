import Joi from 'joi';
import db from '../../config/db';
import bcrypt from '../helpers/bcrypt';
import { generateAuthToken } from '../helpers/token';

export const signup = async (req, res) => {
  const { error, value } = validate(req.body);
  if (error) return res.status(400).json({ error: { message: error.details[0].message } });

  let user = await db.user.findByEmail(req.body.email);
  if (user) return res.status(400).json({ error: { message: 'User already registered.' } });

  user = { name: value.name, email: value.email };
  user.is_admin = value.isAdmin;
  user.password = await bcrypt.hash(value.password);

  user = await db.user.create(user);

  const token = generateAuthToken(user);
  const { id, name, email } = user;
  res.json({ id, name, email, token });
};

export const findMe = async (req, res) => {
  const user = await db.user.findById(req.user._id);
  const { id, name, email } = user;
  res.json({ id, name, email });
};

const validate = user => {
  const schema = {
    name: Joi.string()
      .min(5)
      .max(50)
      .required(),
    email: Joi.string()
      .min(5)
      .max(255)
      .required()
      .email(),
    password: Joi.string()
      .min(5)
      .max(255)
      .required(),
    isAdmin: Joi.boolean().optional(),
  };
  return Joi.validate(user, schema);
};
