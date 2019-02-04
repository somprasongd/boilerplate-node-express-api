import jwt from 'jsonwebtoken';
import config from '../../config';

const users = [
  {
    id: 1,
    name: 'admin',
    email: 'admin@mail.com',
    password: '$2a$10$v/nqGYpcYd1ZAGEKO05MXOtQ1vGPPHIOazpC9gdl./.T9yqbms5EC',
    isAdmin: true,
  },
  {
    id: 2,
    name: 'user1',
    email: 'user1@mail.com',
    password: '$2a$10$v/nqGYpcYd1ZAGEKO05MXOtQ1vGPPHIOazpC9gdl./.T9yqbms5EC',
    isAdmin: false,
  },
  {
    id: 3,
    name: 'user2',
    email: 'user2@mail.com',
    password: '$2a$10$v/nqGYpcYd1ZAGEKO05MXOtQ1vGPPHIOazpC9gdl./.T9yqbms5EC',
    isAdmin: false,
  },
];

class User {
  constructor(name, email, password, isAdmin) {
    this.name = name;
    this.email = email;
    this.password = password;
    this.isAdmin = isAdmin;
  }

  create() {
    this.id = users[users.length - 1].id + 1;
    users.push(this);
    return this;
  }

  static generateAuthToken(user) {
    const token = jwt.sign({ id: user.id, isAdmin: user.isAdmin }, config.api.jwtSecretKey);
    return token;
  }

  static findById(id) {
    return users.find(user => user.id === id);
  }

  static findByEmail(email) {
    return users.find(user => user.email === email);
  }
}

export default User;

// export const generateAuthToken = user => {
//   const token = jwt.sign({ id: user.id, isAdmin: user.isAdmin }, config.JWT_SECRET);
//   return token;
// };

// export const create = (name, email, password, isAdmin) => {
//   const user = {
//     id: users[users.length - 1].id + 1,
//     name,
//     email,
//     password,
//     isAdmin,
//   };
//   users.push(user);
//   return user;
// };

// export const findById = id => users.find(user => user.id === id);

// export const findByEmail = email => users.find(user => user.email === email);
