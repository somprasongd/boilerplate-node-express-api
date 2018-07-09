import * as Pet from '../models/pet';
import paginate from '../helpers/paginate';

export const create = async (req, res) => {
  const data = await Promise.resolve({}); // insert
  return res.json(data);
};

export const findAll = async (req, res) => {
  const { limit, offset, page } = req.query;
  let datas = new Promise(resolve => Pet.findAll().slice(offset, limit)); // query with offset and limit
  let counts = new Promise(resolve => Pet.findAll()); // count with same query criteria
  [datas, counts] = await Promise.all([datas, counts]);
  const results = paginate(datas, counts, limit, offset, page);
  res.send(results);
};

export const findOne = async (req, res) => {
  const { id } = req.params;
  const data = await Promise.resolve(Pet.findById(id)); // find by id
  if (!data) {
    return res.status(404).json({ err: 'could not find data' });
  }
  return res.json(data);
};

export const remove = async (req, res) => {
  const { id } = req.params;
  const data = await Promise.resolve(Pet.remove(id)); // find by id and remove
  if (!data) {
    return res.status(404).json({ err: 'could not find data' });
  }
  return res.json(data);
};

export const update = async (req, res) => {
  const { id } = req.params;
  const user = await Promise.resolve(Pet.findById(id));
  user.name = req.body.name;
  user.category = req.body.category;
  user.breed = req.body.breed;
  user.age = req.body.age;
  // { new: true } is tell mongoose return updated object into pet
  const data = await Promise.resolve(Pet.update(user)); // find by id and update and return update object
  if (!data) {
    return res.status(404).json({ err: 'could not find data' });
  }
  return res.json(data);
};
