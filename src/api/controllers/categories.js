import Joi from 'joi';
import db from '../../config/db';
import paginate from '../helpers/paginate.js';

export const create = async (req, res) => {
  const { error } = validate(req.body);
  if (error) return res.status(400).json({ error: { message: error.details[0].message } });

  const category = await db.category.create({ name: req.body.name });

  res.send(category);
};

export const findAll = async (req, res) => {
  const { limit, offset, page } = req.query;
  let categories = await db.manyOrNone('select * from categories offset $<offset> limit $<limit>', {
    offset,
    limit,
  });
  let counts = await db.one('SELECT count(*) FROM categories', [], a => +a.count);
  [categories, counts] = await Promise.all([categories, counts]);
  const results = paginate(categories, counts, limit, offset, page);
  res.send(results);
};

export const findOne = async (req, res) => {
  const category = await db.category.findById(req.params.id);

  if (!category) return res.status(404).json({ error: { message: 'The category with the given ID was not found.' } });

  res.send(category);
};

export const remove = async (req, res) => {
  const category = await db.category.remove(req.params.id);

  if (!category) return res.status(404).json({ error: { message: 'The category with the given ID was not found.' } });

  res.status(204).end();
};

export const update = async (req, res) => {
  const { error } = validate(req.body);
  if (error) return res.status(400).json({ error: { message: error.details[0].message } });

  let category = await db.category.findById(req.params.id);

  if (!category) return res.status(404).json({ error: { message: 'The category with the given ID was not found.' } });

  category = await db.category.update(req.params.id, req.body);

  res.send(category);
};

function validate(category) {
  const schema = {
    name: Joi.string()
      .max(50)
      .required(),
  };

  return Joi.validate(category, schema);
}
