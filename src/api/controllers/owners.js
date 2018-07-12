import Joi from 'joi';
import db from '../../config/db';
import paginate from '../helpers/paginate.js';

export const create = async (req, res) => {
  const { error } = validate(req.body);
  if (error) return res.status(400).json({ error: { message: error.details[0].message } });

  const owner = await db.owners.create(req.body);

  res.send(owner);
};

export const findAll = async (req, res) => {
  const { limit, offset, page } = req.query;
  let categories = await db.manyOrNone('select * from owners offset $<offset> limit $<limit>', {
    offset,
    limit,
  });
  let counts = await db.one('SELECT count(*) FROM owners', [], a => +a.count);
  [categories, counts] = await Promise.all([categories, counts]);
  const results = paginate(categories, counts, limit, offset, page);
  res.send(results);
};

export const findOne = async (req, res) => {
  const owner = await db.owners.findById(req.params.id);

  if (!owner) return res.status(404).json({ error: { message: 'The owner with the given ID was not found.' } });

  res.send(owner);
};

export const remove = async (req, res) => {
  const owner = await db.owners.remove(req.params.id);

  if (!owner) return res.status(404).json({ error: { message: 'The owner with the given ID was not found.' } });

  res.status(204).end();
};

export const update = async (req, res) => {
  const { error, value } = validate(req.body);
  if (error) return res.status(400).json({ error: { message: error.details[0].message } });

  const owner = await db.owners.update(req.params.id, value);
  if (!owner) return res.status(404).json({ error: { message: 'The owner with the given ID was not found.' } });

  res.send(owner);
};

function validate(owner) {
  const schema = {
    name: Joi.string()
      .min(5)
      .max(50)
      .required(),
    phone: Joi.string()
      .min(9)
      .max(10)
      .optional(),
  };

  return Joi.validate(owner, schema);
}
