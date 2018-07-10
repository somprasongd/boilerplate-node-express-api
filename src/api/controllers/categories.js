import { Category, validate } from '../models/category';
import paginate from '../helpers/paginate.js';

export const create = async (req, res) => {
  const { error } = validate(req.body);
  if (error) return res.status(400).json({ error: { message: error.details.map(detail => detail.message) } });

  let category = new Category({ name: req.body.name });
  category = await category.save();

  res.send(category);
};

export const findAll = async (req, res) => {
  const { limit, offset, page } = req.query;
  let categories = Category.find()
    .sort('name')
    .skip(offset)
    .limit(limit);
  let counts = Category.count({}).exec();
  [categories, counts] = await Promise.all([categories, counts]);
  const results = paginate(categories, counts, limit, offset, page);
  res.send(results);
};

export const findOne = async (req, res) => {
  const category = await Category.findById(req.params.id);

  if (!category) return res.status(404).json({ error: { message: 'The category with the given ID was not found.' } });

  res.send(category);
};

export const remove = async (req, res) => {
  const category = await Category.findByIdAndRemove(req.params.id);

  if (!category) return res.status(404).json({ error: { message: 'The category with the given ID was not found.' } });

  res.send(category);
};

export const update = async (req, res) => {
  const { error } = validate(req.body);
  if (error) return res.status(400).json({ error: { message: error.details.map(detail => detail.message) } });

  const category = await Category.findByIdAndUpdate(req.params.id, { name: req.body.name }, { new: true });

  if (!category) return res.status(404).json({ error: { message: 'The category with the given ID was not found.' } });

  res.send(category);
};
