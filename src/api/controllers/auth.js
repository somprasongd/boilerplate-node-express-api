import Joi from 'joi';
import bcrypt from 'bcrypt-nodejs';
import * as User from '../models/user';

export const login = async (req, res) => {
  const { error } = validate(req.body);
  if (error) return res.status(400).send(error.details[0].message);

  const user = await User.findByEmail(req.body.email);
  if (!user) return res.status(400).send('Invalid email or password.');

  const validPassword = await new Promise((resolve, reject) => {
    console.log(req.body.password);
    console.log(user.password);
    bcrypt.compare(req.body.password, user.password, (err, result) => {
      if (err) return reject(err);
      console.log(result);
      resolve(result);
    });
  });

  if (!validPassword) return res.status(400).send('Invalid email or password.');

  const token = User.generateAuthToken(user);
  res.send(token);
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
