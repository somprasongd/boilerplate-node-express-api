import Joi from 'joi';
import db from '../../config/db';
import bcrypt from '../helpers/bcrypt';
import { generateAuthToken, verifyAuthToken } from '../helpers/token';

export const login = async (req, res) => {
  const schema = {
    username: Joi.string().required(),
    password: Joi.string().required(),
  };

  const { error, value } = Joi.validate(req.body, schema);
  if (error) return res.status(400).json({ error: { message: error.details[0].message } });

  const user = await db.users.findByEmail(value.email);
  if (!user) return res.status(400).json({ error: { message: 'Invalid email or password.' } });

  const validPassword = await bcrypt.compare(value.password, user.password);
  if (!validPassword) return res.status(400).json({ error: { message: 'Invalid email or password.' } });

  const token = generateAuthToken(user);
  const { id, name, email, isAdmin } = user;
  res.json({ id, name, email, isAdmin, token });
};

export const logout = async (req, res) => {
  res.send(true);
};

export const refresh = async (req, res) => {
  const { error, value } = validateToken(req.body);
  if (error) return res.status(400).json({ error: { message: error.details[0].message } });

  try {
    let user = verifyAuthToken(value.token);
    user = await db.users.findById(user.id);
    if (!user) return res.status(400).json({ error: { message: 'Invalid user id.' } });
    const token = generateAuthToken(user);
    const { id, name, email, isAdmin } = user;
    res.json({ id, name, email, isAdmin, token });
  } catch (ex) {
    res.status(401).json({ error: { message: 'Access denied. Invalid token.' } });
  }
};

export const verify = async (req, res) => {
  const { error, value } = validateToken(req.body);
  if (error) return res.status(400).json({ error: { message: error.details[0].message } });

  try {
    const { token } = value;
    let user = verifyAuthToken(token);
    user = await db.users.findById(user.id);
    if (!user) return res.status(400).json({ error: { message: 'Invalid user id.' } });

    const { id, name, email, isAdmin } = user;
    res.json({ id, name, email, isAdmin, token });
  } catch (ex) {
    res.status(401).json({ error: { message: 'Access denied. Invalid token.' } });
  }
};

function validateToken(req) {
  const schema = {
    token: Joi.string().required(),
  };

  return Joi.validate(req, schema);
}
