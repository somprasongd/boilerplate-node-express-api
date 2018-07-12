import Joi from 'joi';
import db from '../../config/db';
import paginate from '../helpers/paginate.js';

export const create = async (req, res) => {
  const schema = Joi.object().keys({
    name: Joi.string()
      .min(2)
      .max(50)
      .required(),
    categoryId: Joi.number().required(),
    breed: Joi.string().required(),
    age: Joi.string().required(),
    ownerId: Joi.number().required(),
  });
  const { error, value } = Joi.validate(req.body, schema);
  if (error) return res.status(400).json({ error: { message: error.details[0].message } });

  const pet = {
    name: value.name,
    breed: value.breed,
    age: value.age,
    category_id: value.categoryId,
    owner_id: value.ownerId,
  };

  const result = await db.tx(async t => {
    const data = await t.pets.create(pet);
    await t.owners.incPetCount(pet.owner_id);
    return data;
  });

  res.send(result);
};

export const findAll = async (req, res) => {
  const { limit, offset, page } = req.query;
  const { datas, counts } = await db.task(async t => {
    const p1 = t.manyOrNone('select * from pets offset $<offset> limit $<limit>', {
      offset,
      limit,
    });
    const p2 = t.one('SELECT count(*) FROM pets', [], a => +a.count);
    const [datas, counts] = await Promise.all([p1, p2]);
    return { datas, counts };
  });

  const results = paginate(datas, counts, limit, offset, page);
  res.send(results);
};

export const findOne = async (req, res) => {
  const pet = await db.pets.findById(req.params.id);

  if (!pet) return res.status(404).json({ error: { message: 'The pet with the given ID was not found.' } });

  res.send(pet);
};

export const remove = async (req, res) => {
  const pet = await db.pets.remove(req.params.id);

  if (!pet) return res.status(404).json({ error: { message: 'The pet with the given ID was not found.' } });

  res.status(204).end();
};

export const update = async (req, res) => {
  const schema = {
    name: Joi.string()
      .min(2)
      .max(50)
      .optional(),
    categoryId: Joi.number().optional(),
    breed: Joi.string().optional(),
    age: Joi.string().optional(),
    ownerId: Joi.number().optional(),
  };

  const { error, value } = Joi.validate(req.body, schema);
  if (error) return res.status(400).json({ error: { message: error.details[0].message } });

  const pet = await db.pets.update(req.params.id, value);
  if (!pet) return res.status(404).json({ error: { message: 'The pet with the given ID was not found.' } });

  res.send(pet);
};
