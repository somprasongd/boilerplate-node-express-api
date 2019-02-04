import Pet from '../../db/models/pet';
import pagination from '../../helpers/pagination';

export const create = async (req, res) => {
  const { name, category, breed, age } = req.body;
  const pet = new Pet(name, category, breed, age);
  const data = await Promise.resolve(pet.create()); // insert
  return res.json(data);
};

export const findAll = async (req, res) => {
  const { limit, offset, page } = req.query;
  // query with offset and limit
  let datas = new Promise(resolve => resolve(Pet.findAll().slice(offset, limit + offset)));

  // count with same query criteria
  let counts = new Promise(resolve => resolve(Pet.findAll().length));
  [datas, counts] = await Promise.all([datas, counts]);
  console.log(datas);
  const results = pagination(datas, counts, limit, offset, page);
  res.send(results);
};

export const findOne = async (req, res) => {
  const { id } = req.params;
  // find by id
  const data = await Promise.resolve(Pet.findById(+id));
  if (!data) {
    return res.status(404).json({ error: { message: 'could not find data' } });
  }
  return res.json(data);
};

export const remove = async (req, res, next) => {
  const { id } = req.params;
  // find by id and remove
  const pet = await Promise.resolve(Pet.findById(+id));
  if (!pet) {
    const err = new Error('could not find data');
    err.status = 404;
    return next(err);
  }
  const data = await Promise.resolve(Pet.remove(+id));
  if (!data) {
    const err = new Error('could not find data');
    err.status = 404;
    return next(err);
  }
  return res.json(data);
};

export const update = async (req, res, next) => {
  const { id } = req.params;
  // find by id and update
  const user = await Promise.resolve(Pet.findById(+id));
  if (!user) {
    const err = new Error('could not find data');
    err.status = 404;
    return next(err);
  }
  const { name, category, breed, age } = req.body;
  const pet = new Pet(name, category, breed, age);
  const data = await Promise.resolve(pet.update(id));
  return res.json(data);
};
