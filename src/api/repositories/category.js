import Repository from '../helpers/repository';

export default class CategoryRepository extends Repository {
  constructor(db, pgp) {
    super(db, pgp, 'categories', {});
  }
}
