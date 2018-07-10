import bcrypt from '../helpers/bcrypt';
import * as User from '../models/user';

export const signup = async (req, res) => {
  const { error } = User.validate(req.body);
  if (error) return res.status(400).json({ err: error.details.map(detail => detail.message) });

  let user = await User.findByEmail({ email: req.body.email });
  if (user) return res.status(400).json({ err: 'User already registered.' });

  const { name, email, password } = req.body;
  user = { name, email, password };

  user.password = await bcrypt.hash(password);
  user = User.create(user);

  const token = User.generateAuthToken(user);
  const { id } = user;
  res.send({ id, name, email, token });
};

export const findOne = async (req, res) => {
  const user = await new Promise(resolve => {
    setTimeout(() => {
      resolve(User.findById(req.user.id));
    }, 1000);
  });
  if (!user) return res.status(400).json({ err: 'Invalid user Id' });
  const { id, name, email } = user;
  res.send({ id, name, email });
};
