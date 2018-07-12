import Repository from '../helpers/repository';

export default class CategoriesRepository extends Repository {
  constructor(db, pgp) {
    super(db, pgp, 'categories', {});
  }
}
