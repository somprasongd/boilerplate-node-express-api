import bcrypt from 'bcryptjs';

const hash = plainText =>
  new Promise((resolve, reject) => {
    bcrypt.genSalt(10, (err, salt) => {
      if (err) return reject(err);
      bcrypt.hash(plainText, salt, (e, hashed) => {
        if (e) return reject(e);
        resolve(hashed);
      });
    });
  });

const compare = (plainText, hashed) =>
  new Promise((resolve, reject) => {
    bcrypt.compare(plainText, hashed, (err, res) => {
      if (err) return reject(err);
      resolve(res);
    });
  });

export default {
  hash,
  compare,
};
