import Repository from '../helpers/repository';

export default class OwnerRepository extends Repository {
  constructor(db, pgp) {
    super(db, pgp, 'owners', {});
  }

  incPetCount(id) {
    return this.db.none('UPDATE owners SET pet_count = pet_count + 1 WHERE id = $1', [id]);
  }
}
