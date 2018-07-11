import Joi from 'joi';
import db from '../../config/db';
import bcrypt from '../helpers/bcrypt';
import { generateAuthToken } from '../helpers/token';

export const login = async (req, res) => {
  const { error } = validate(req.body);
  if (error) return res.status(400).json({ error: { message: error.details[0].message } });

  const user = await db.user.findByEmail(req.body.email);
  if (!user) return res.status(400).json({ error: { message: 'Invalid email or password.' } });

  const validPassword = await bcrypt.compare(req.body.password, user.password);
  if (!validPassword) return res.status(400).json({ error: { message: 'Invalid email or password.' } });

  const token = generateAuthToken(user);
  const { id, name, email, isAdmin } = user;
  res.send({ id, name, email, isAdmin, token });
};

export const logout = async (req, res) => {
  res.send(true);
};

function validate(req) {
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

  return Joi.validate(req, schema);
}
