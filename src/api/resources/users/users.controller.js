import bcrypt from 'bcrypt-nodejs';
import { User, validate } from '../../models/user';

export const create = async (req, res) => {
  const { error } = validate(req.body);
  if (error) return res.status(400).send(error.details[0].message);

  let user = await User.findOne({ email: req.body.email });
  if (user) return res.status(400).send('User already registered.');

  const { name, email, password } = req.body;
  user = new User({ name, email, password });
  const salt = await bcrypt.genSalt(10);
  user.password = await bcrypt.hash(user.password, salt);
  await user.save();

  const token = user.generateAuthToken();
  const { _id } = user;
  res.header('x-auth-token', token).send({ _id, name, email });
};

export const findOne = async (req, res) => {
  const user = await User.findById(req.user._id).select('-password');
  res.send(user);
};
