import Joi from 'joi';
import db from '../../config/db';
import paginate from '../helpers/paginate.js';

export const create = async (req, res) => {
  const { error, value } = validate(req.body);
  if (error) return res.status(400).json({ error: { message: error.details[0].message } });

  const { name, categoryId, breed, age, ownerId } = value;
  const pet = {
    name: value.name,
    breed: value.breed,
    age: value.age,
    category_id: value.categoryId,
    owner_id: value.ownerId,
  };

  const result = await db.tx(async t => {
    const data = await t.pet.create(pet);
    await t.none('UPDATE owner SET pet_count = pet_count + 1 WHERE id = $1', [pet.owner_id]);
    return data;
  });

  res.send(result);
};

export const findAll = async (req, res) => {
  const { limit, offset, page } = req.query;
  let categories = await db.manyOrNone('select * from pet offset $<offset> limit $<limit>', {
    offset,
    limit,
  });
  let counts = await db.one('SELECT count(*) FROM pet', [], a => +a.count);
  [categories, counts] = await Promise.all([categories, counts]);
  const results = paginate(categories, counts, limit, offset, page);
  res.send(results);
};

export const findOne = async (req, res) => {
  const pet = await db.pet.findById(req.params.id);

  if (!pet) return res.status(404).json({ error: { message: 'The pet with the given ID was not found.' } });

  res.send(pet);
};

export const remove = async (req, res) => {
  const pet = await db.pet.remove(req.params.id);

  if (!pet) return res.status(404).json({ error: { message: 'The pet with the given ID was not found.' } });

  res.status(204).end();
};

export const update = async (req, res) => {
  const { error } = validate(req.body);
  if (error) return res.status(400).json({ error: { message: error.details[0].message } });

  let pet = await db.pet.findById(req.params.id);

  if (!pet) return res.status(404).json({ error: { message: 'The pet with the given ID was not found.' } });

  pet = await db.pet.update(req.params.id, req.body);

  res.send(pet);
};

function validate(pet) {
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
  return Joi.validate(pet, schema);
}
