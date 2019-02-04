import Joi from 'joi';
import bcrypt from '../../helpers/bcrypt';
import User from '../../db/models/user';

export const signup = async (req, res, next) => {
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
  };
  const { error, value } = Joi.validate(req.body, schema);
  if (error) {
    const err = new Error(error.details[0].message);
    err.status = 400;
    return next(err);
  }

  let user = await User.findByEmail({ email: req.body.email });
  if (user) {
    const err = new Error('User already registered.');
    err.status = 400;
    return next(err);
  }

  const { name, email, password } = value;
  user = new User(name, email, password);

  user.password = await bcrypt.hash(password);
  user = user.create();

  const token = User.generateAuthToken(user);
  const { id } = user;
  res.send({ id, name, email, token });
};

export const findOne = async (req, res, next) => {
  const user = await new Promise(resolve => {
    setTimeout(() => {
      resolve(User.findById(req.user.id));
    }, 1000);
  });
  if (!user) {
    const err = new Error('Invalid user Id');
    err.status = 400;
    return next(err);
  }
  const { id, name, email } = user;
  res.send({ id, name, email });
};
