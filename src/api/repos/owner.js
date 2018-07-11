import Joi from 'joi';

export default class OwnerRepository {
  constructor(db, pgp) {
    this.db = db;
    this.pgp = pgp;
  }

  create(obj) {
    return this.db.one('INSERT INTO owner ($<this:name>) VALUES($<this:csv>) RETURNING *', obj);
  }

  update(id, obj) {
    return this.db.one('UPDATE owner set($<$2:name>) VALUES($<$2:csv>) WHERE id = $1 RETURNING *', [+id, obj]);
  }

  // Tries to delete a owner by id, and returns the number of records deleted;
  remove(id) {
    return this.db.result('DELETE FROM owner WHERE id = $1', +id, r => r.rowCount);
  }

  all() {
    return this.db.any('SELECT * FROM owner');
  }

  // Tries to find a owner from id;
  findById(id) {
    return this.db.oneOrNone('SELECT * FROM owner WHERE id = $1', +id);
  }

  find(obj) {
    return this.db.manyOrNone('SELECT * FROM owner WHERE $<this:name> = $<this:csv>', obj);
  }
}

export const validate = owner => {
  const schema = {
    name: Joi.string()
      .min(5)
      .max(50)
      .required(),
    phone: Joi.string()
      .min(9)
      .max(10)
      .optional(),
  };
  return Joi.validate(owner, schema);
};
