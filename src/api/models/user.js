import jwt from 'jsonwebtoken';
import Joi from 'joi';
import config from '../../config';

const users = [
  {
    id: 1,
    name: 'admin',
    email: 'admin@mail.com',
    password: '$2a$10$pxm3qveeachHam7KiRpsHePkN8pZ1WdqrHyfM1AoVrEHRrZszK6hy',
    isAdmin: true,
  },
  {
    id: 2,
    name: 'user1',
    email: 'user1@mail.com',
    password: '$2a$10$pxm3qveeachHam7KiRpsHePkN8pZ1WdqrHyfM1AoVrEHRrZszK6hy',
    isAdmin: false,
  },
  {
    id: 3,
    name: 'user2',
    email: 'user2@mail.com',
    password: '$2a$10$pxm3qveeachHam7KiRpsHePkN8pZ1WdqrHyfM1AoVrEHRrZszK6hy',
    isAdmin: false,
  },
];

export const generateAuthToken = user => {
  const token = jwt.sign({ id: user.id, isAdmin: user.isAdmin }, config.JWT_SECRET);
  return token;
};

export const create = (name, email, password, isAdmin) => {
  const user = {
    id: users[users.length - 1].id + 1,
    name,
    email,
    password,
    isAdmin,
  };
  users.push(user);
  return user;
};

export const findById = id => users.find(user => user.id === id);

export const findByEmail = email => users.find(user => user.email === email);

export const validate = user => {
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
  return Joi.validate(user, schema);
};
