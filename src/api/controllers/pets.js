import * as Pet from '../models/pet';
import paginate from '../helpers/paginate';

export const create = async (req, res) => {
  const { name, category, breed, age } = req.body;
  const data = await Promise.resolve(Pet.create(name, category, breed, age)); // insert
  return res.json(data);
};

export const findAll = async (req, res) => {
  const { limit, offset, page } = req.query;
  // query with offset and limit
  let datas = new Promise(resolve => resolve(Pet.findAll().slice(offset, limit + offset)));
  // count with same query criteria
  let counts = new Promise(resolve => resolve(Pet.findAll().length));
  [datas, counts] = await Promise.all([datas, counts]);
  const results = paginate(datas, counts, limit, offset, page);
  res.send(results);
};

export const findOne = async (req, res) => {
  const { id } = req.params;
  // find by id
  const data = await Promise.resolve(Pet.findById(+id));
  if (!data) {
    return res.status(404).json({ err: 'could not find data' });
  }
  return res.json(data);
};

export const remove = async (req, res) => {
  const { id } = req.params;
  // find by id and remove
  const user = await Promise.resolve(Pet.findById(+id));
  if (!user) {
    return res.status(404).json({ err: 'could not find data' });
  }
  const data = await Promise.resolve(Pet.remove(+id));
  if (!data) {
    return res.status(404).json({ err: 'could not find data' });
  }
  return res.json(data);
};

export const update = async (req, res) => {
  const { id } = req.params;
  // find by id and update
  const user = await Promise.resolve(Pet.findById(+id));
  if (!user) {
    return res.status(404).json({ err: 'could not find data' });
  }
  const { name, category, breed, age } = req.body;
  const data = await Promise.resolve(Pet.update(id, name, category, breed, age));
  return res.json(data);
};
