import Joi from 'joi';
import bcrypt from '../helpers/bcrypt';
import { User } from '../models/user';

export const login = async (req, res) => {
  const { error } = validate(req.body);
  if (error) return res.status(400).json({ error: { message: error.details.map(detail => detail.message) } });

  const user = await User.findOne({ email: req.body.email });
  if (!user) return res.status(400).json({ error: { message: 'Invalid email or password.' } });

  const validPassword = await bcrypt.compare(req.body.password, user.password);
  if (!validPassword) return res.status(400).json({ error: { message: 'Invalid email or password.' } });

  const token = user.generateAuthToken(user);
  const { _id, name, email } = user;
  res.send({ _id, name, email, token });
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
