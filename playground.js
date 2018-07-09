const bcrypt = require('bcrypt-nodejs');

bcrypt.hash('p@ssw0rd', null, null, (err, hash) => {
  console.log(hash);
});

// Load hash from your password DB.
bcrypt.compare(`p@ssw0rd`, `$2a$10$pxm3qveeachHam7KiRpsHePkN8pZ1WdqrHyfM1AoVrEHRrZszK6hy`, (err, res) => {
  console.log(res);
});
