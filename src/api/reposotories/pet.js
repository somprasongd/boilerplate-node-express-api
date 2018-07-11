import renameObjectKey from '../helpers/renameObjectKey';

export default class OwnerRepository {
  constructor(db, pgp) {
    this.db = db;
    this.pgp = pgp;
  }

  get keyMap() {
    this._ketMap = {
      categoryId: 'category_id',
      ownerId: 'owner_id',
    };
    return this._ketMap;
  }

  create(obj) {
    const values = renameObjectKey(obj, this.keyMap);
    return this.db.one('INSERT INTO pet ($<this:name>) VALUES($<this:csv>) RETURNING *', values);
  }

  update(id, obj) {
    const values = renameObjectKey(obj, this.keyMap);
    return this.db.one('UPDATE pet set ($<this:name>)=($<this:csv>) WHERE id = 1 RETURNING *', values);
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
