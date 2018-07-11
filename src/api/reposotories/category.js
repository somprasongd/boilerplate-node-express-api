import Joi from 'joi';

export default class CategoryRepository {
  constructor(db, pgp) {
    this.db = db;
    this.pgp = pgp;
  }

  create(obj) {
    return this.db.one('INSERT INTO category ($<this:name>) VALUES($<this:csv>) RETURNING *', obj);
  }

  update(id, obj) {
    return this.db.one('UPDATE category set($<$2:name>) VALUES($<$2:csv>) WHERE id = $1 RETURNING *', [+id, obj]);
  }

  // Tries to delete a category by id, and returns the number of records deleted;
  remove(id) {
    return this.db.result('DELETE FROM category WHERE id = $1', +id, r => r.rowCount);
  }

  all() {
    return this.db.any('SELECT * FROM category');
  }

  // Tries to find a category from id;
  findById(id) {
    return this.db.oneOrNone('SELECT * FROM category WHERE id = $1', +id);
  }

  find(obj) {
    return this.db.manyOrNone('SELECT * FROM category WHERE $<this:name> = $<this:csv>', obj);
  }
}

export const validate = category => {
  const schema = {
    name: Joi.string()
      .max(50)
      .required(),
  };
  return Joi.validate(category, schema);
};
