import bcrypt from 'bcrypt-nodejs';
import * as User from '../models/user';

export const create = async (req, res) => {
  const { error } = User.validate(req.body);
  if (error) return res.status(400).send(error.details[0].message);

  let user = await User.findByEmail({ email: req.body.email });
  if (user) return res.status(400).send('User already registered.');

  const { name, email, password } = req.body;
  user = { name, email, password };
  const salt = await new Promise((resolve, reject) => {
    bcrypt.genSalt(10, (err, data) => {
      if (err) return reject(err);
      resolve(data);
    });
  });

  user.password = await new Promise((resolve, reject) => {
    bcrypt.hash(password, salt, null, (err, hash) => {
      if (err) return reject(err);
      resolve(hash);
    });
  });
  user = User.create(user);

  const token = User.generateAuthToken(user);
  const { id } = user;
  res.header('x-auth-token', token).send({ id, name, email });
};

export const findOne = async (req, res) => {
  const user = await new Promise((resolve, reject) => {
    setTimeout(() => {
      resolve(User.findById(req.user.id));
    }, 1000);
  });
  const { id, name, email } = user;
  res.send({ id, name, email });
};
