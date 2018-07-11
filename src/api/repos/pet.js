import Joi from 'joi';

export default class OwnerRepository {
  constructor(db, pgp) {
    this.db = db;
    this.pgp = pgp;
  }

  create(obj) {
    return this.db.one('INSERT INTO pet ($<this:name>) VALUES($<this:csv>) RETURNING *', obj);
  }

  update(id, obj) {
    return this.db.one('UPDATE pet set($<$2:name>) VALUES($<$2:csv>) WHERE id = $1 RETURNING *', [+id, obj]);
  }

  // Tries to delete a pet by id, and returns the number of records deleted;
  remove(id) {
    return this.db.result('DELETE FROM pet WHERE id = $1', +id, r => r.rowCount);
  }

  all() {
    return this.db.any('SELECT * FROM pet');
  }

  // Tries to find a pet from id;
  findById(id) {
    return this.db.oneOrNone('SELECT * FROM pet WHERE id = $1', +id);
  }

  find(obj) {
    return this.db.manyOrNone('SELECT * FROM pet WHERE $<this:name> = $<this:csv>', obj);
  }
}

export const validate = pet => {
  const schema = Joi.object().keys({
    name: Joi.string()
      .min(2)
      .max(50)
      .required(),
    categoryId: Joi.objectId().required(),
    breed: Joi.string().required(),
    age: Joi.string().required(),
    ownerId: Joi.objectId().required(),
  });
  return Joi.validate(pet, schema);
};
