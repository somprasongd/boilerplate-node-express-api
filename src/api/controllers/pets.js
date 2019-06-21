import db from '../../db';
import pagination from '../../helpers/pagination';
import { notFoundExceptionHandler } from '../../helpers/exceptionHandler';

export const create = async (req, res) => {
  const { name, category, breed, age } = req.body;
  const pet = new db.Pet(name, category, breed, age);
  const data = await Promise.resolve(pet.create()); // insert
  return res.json(data);
};

export const findAll = async (req, res, next) => {
  const { limit, offset, page } = req.query;
  // query with offset and limit
  let datas = new Promise(resolve => resolve(db.Pet.findAll().slice(offset, limit + offset)));

  // count with same query criteria
  let counts = new Promise(resolve => resolve(db.Pet.findAll().length));
  [datas, counts] = await Promise.all([datas, counts]);
  const results = pagination(datas, counts, limit, offset, page);
  res.send(results);
};

export const findOne = async (req, res) => {
  const { id } = req.params;
  // find by id
  const data = await Promise.resolve(db.Pet.findById(+id));

  if (!data) return notFoundExceptionHandler('The pet with the given ID was not found.');

  return res.json(data);
};

export const remove = async (req, res, next) => {
  const { id } = req.params;
  // find by id and remove
  const pet = await Promise.resolve(db.Pet.findById(+id));
  if (!pet) return notFoundExceptionHandler('The pet with the given ID was not found.');

  const data = await Promise.resolve(db.Pet.remove(+id));

  return res.json(data);
};

export const update = async (req, res, next) => {
  const { id } = req.params;
  // find by id and update
  let pet = await Promise.resolve(db.Pet.findById(+id));
  if (!pet) return notFoundExceptionHandler('The pet with the given ID was not found.');

  const { name, category, breed, age } = req.body;
  pet = new db.Pet(name, category, breed, age);
  const data = await Promise.resolve(pet.update(id));
  return res.json(data);
};
