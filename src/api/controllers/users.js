import bcrypt from '../helpers/bcrypt';
import { User, validate } from '../models/user';

export const signup = async (req, res) => {
  const { error } = validate(req.body);
  if (error) return res.status(400).json({ error: { message: error.details[0].message } });

  let user = await User.findOne({ email: req.body.email });
  if (user) return res.status(400).json({ error: { message: 'User already registered.' } });

  const { name, email, password } = req.body;
  user = new User({ name, email, password });
  user.password = await bcrypt.hash(user.password);

  await user.save();

  const token = user.generateAuthToken();
  const { _id } = user;
  res.json({ _id, name, email, token });
};

export const findMe = async (req, res) => {
  const user = await User.findById(req.user._id).select('-password');
  res.send(user);
};
