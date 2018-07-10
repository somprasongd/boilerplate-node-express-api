import Fawn from 'fawn';
import { Owner } from '../models/owner';
import { Pet, validate } from '../models/pet';
import { Category } from '../models/category';
import paginate from '../helpers/paginate.js';

export const create = async (req, res) => {
  const { error } = validate(req.body);

  if (error) return res.status(400).json({ error: { message: error.details.map(detail => detail.message) } });

  const category = await Category.findById(req.body.categoryId);
  if (!category) return res.status(400).json({ error: { message: 'Invalid category.' } });

  const pet = new Pet({
    name: req.body.name,
    category: {
      _id: category._id,
      name: category.name,
    },
    breed: req.body.breed,
    age: req.body.age,
    ownerId: req.body.ownerId,
  });

  const task = Fawn.Task();
  task.save(Pet, pet);
  task.update(Owner, { _id: pet.ownerId }, { $inc: { petCount: 1 } });
  task.run({ useMongoose: true });
  return res.json(pet);
};

export const findAll = async (req, res) => {
  const { limit, offset, page } = req.query;
  let pets = await Pet.find()
    .sort('name')
    .skip(offset)
    .limit(limit);
  let counts = Pet.count({}).exec();
  [pets, counts] = await Promise.all([pets, counts]);
  const results = paginate(pets, counts, limit, offset, page);
  res.send(results);
};

export const findOne = async (req, res) => {
  const pet = await Pet.findById(req.params.id);

  if (!pet) return res.status(404).json({ error: { message: 'The pet with the given ID was not found.' } });

  res.send(pet);
};

export const remove = async (req, res) => {
  const pet = await Pet.findByIdAndRemove(req.params.id);

  if (!pet) return res.status(404).json({ error: { message: 'The pet with the given ID was not found.' } });

  res.send(pet);
};

export const update = async (req, res) => {
  const { error } = validate(req.body);
  if (error) return res.status(400).json({ error: { message: error.details.map(detail => detail.message) } });

  const category = await Category.findById(req.body.categoryId);
  if (!category) return res.status(400).json({ error: { message: 'Invalid category.' } });

  const pet = await Pet.findByIdAndUpdate(
    req.params.id,
    {
      name: req.body.name,
      category: {
        _id: category._id,
        name: category.name,
      },
      breed: req.body.breed,
      age: req.body.age,
      ownerId: req.user._id,
    },
    { new: true }
  );

  if (!pet) return res.status(404).json({ error: { message: 'The pet with the given ID was not found.' } });

  res.send(pet);
};
