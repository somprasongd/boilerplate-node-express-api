import renameObjectKey from './renameObjectKey';

export default class {
  constructor(db, pgp, tableName, keyMap) {
    this.db = db;
    this.pgp = pgp;
    this.tableName = tableName;
    this.keyMap = keyMap || {};
  }

  columnize(obj) {
    return renameObjectKey(obj, this.keyMap);
  }

  create(obj) {
    return this.db.one(
      `INSERT INTO ${this.tableName} ($<this:name>) VALUES($<this:csv>) RETURNING *`,
      this.columnize(obj)
    );
  }

  update(id, obj) {
    return this.db.oneOrNone(`UPDATE ${this.tableName} set ($2:name)=($2:csv) WHERE id = $1 RETURNING *`, [
      +id,
      this.columnize(obj),
    ]);
  }

  // Tries to delete a pet by id, and returns the number of records deleted;
  remove(id) {
    return this.db.result(`DELETE FROM ${this.tableName} WHERE id = $1`, +id, r => r.rowCount);
  }

  all() {
    return this.db.any(`SELECT * FROM ${this.tableName}`);
  }

  count() {
    return this.db.one(`SELECT count(*) FROM ${this.tableName}`, [], a => +a.count);
  }

  find(obj) {
    return this.db.manyOrNone(`SELECT * FROM ${this.tableName} WHERE $<this:name> = $<this:csv>`, this.columnize(obj));
  }

  findById(id) {
    return this.db.oneOrNone(`SELECT * FROM ${this.tableName} WHERE id = $1`, +id);
  }
}
