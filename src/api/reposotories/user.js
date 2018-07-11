export default class UserRepository {
  constructor(db, pgp) {
    this.db = db;
    this.pgp = pgp;
  }

  create(obj) {
    return this.db.one('INSERT INTO "user" ($<this:name>) VALUES($<this:csv>) RETURNING *', obj);
  }

  update(id, obj) {
    return this.db.one('UPDATE "user" set($<$2:name>) VALUES($<$2:csv>) WHERE id = $1 RETURNING *', [+id, obj]);
  }

  // Tries to delete a "user" by id, and returns the number of records deleted;
  remove(id) {
    return this.db.result('DELETE FROM "user" WHERE id = $1', +id, r => r.rowCount);
  }

  all() {
    return this.db.any('SELECT * FROM "user"');
  }

  // Tries to find a user from id;
  findById(id) {
    return this.db.oneOrNone('SELECT * FROM "user" WHERE id = $1', +id);
  }

  // Tries to find a user from email;
  findByEmail(email) {
    return this.db.oneOrNone('SELECT * FROM "user" WHERE email = $1', email);
  }

  find(obj) {
    return this.db.manyOrNone('SELECT * FROM "user" WHERE $<this:name> = $<this:csv>', obj);
  }

  incPetCount(id) {
    return this.db.none('UPDATE owner SET pet_count = pet_count + 1 WHERE id = $1', [id]);
  }
}
