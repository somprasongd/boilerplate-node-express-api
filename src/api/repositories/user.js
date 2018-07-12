import Repository from '../helpers/repository';

export default class UserRepository extends Repository {
  constructor(db, pgp) {
    super(db, pgp, 'users', {});
  }

  findByEmail(email) {
    return this.db.oneOrNone('SELECT * FROM users WHERE email = $1', email);
  }
}
