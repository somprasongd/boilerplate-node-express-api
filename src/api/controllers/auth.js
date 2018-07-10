import Joi from 'joi';
import bcrypt from '../helpers/bcrypt';
import * as User from '../models/user';

export const login = async (req, res) => {
  const { error } = validate(req.body);
  if (error) return res.status(400).json({ err: error.details[0].message });

  const user = await User.findByEmail(req.body.email);
  if (!user) return res.status(400).json({ err: 'Invalid email or password.' });

  const validPassword = await bcrypt.compare(req.body.password, user.password);

  if (!validPassword) return res.status(400).json({ err: 'Invalid email or password.' });

  const token = User.generateAuthToken(user);
  const { id, name, email } = user;
  res.send({ id, name, email, token });
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
