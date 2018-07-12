import Repository from '../helpers/repository';

export default class OwnerRepository extends Repository {
  constructor(db, pgp) {
    super(db, pgp, 'pets', {
      categoryId: 'category_id',
      ownerId: 'owner_id',
    });
  }
}
