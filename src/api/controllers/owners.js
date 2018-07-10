import { Owner, validate } from '../models/owner';
import paginate from '../helpers/paginate.js';

export const create = async (req, res) => {
  const { error } = validate(req.body);
  if (error) return res.status(400).json({ error: { message: error.details.map(detail => detail.message) } });

  let owner = new Owner({
    name: req.body.name,
    phone: req.body.phone,
  });
  owner = await owner.save();

  res.send(owner);
};

export const findAll = async (req, res) => {
  const { limit, offset, page } = req.query;
  let owners = Owner.find()
    .sort('name')
    .skip(offset)
    .limit(limit);
  let counts = Owner.count({}).exec();
  [owners, counts] = await Promise.all([owners, counts]);
  const results = paginate(owners, counts, limit, offset, page);
  res.send(results);
};

export const findOne = async (req, res) => {
  const owner = await Owner.findById(req.params.id);

  if (!owner) return res.status(404).json({ error: { message: 'The owner with the given ID was not found.' } });

  res.send(owner);
};

export const remove = async (req, res) => {
  const owner = await Owner.findByIdAndRemove(req.params.id);

  if (!owner) return res.status(404).json({ error: { message: 'The owner with the given ID was not found.' } });

  res.send(owner);
};

export const update = async (req, res) => {
  const { error } = validate(req.body);
  if (error) return res.status(400).json({ error: { message: error.details.map(detail => detail.message) } });

  const owner = await Owner.findByIdAndUpdate(
    req.params.id,
    {
      name: req.body.name,
      phone: req.body.phone,
    },
    { new: true }
  );

  if (!owner) return res.status(404).json({ error: { message: 'The owner with the given ID was not found.' } });

  res.send(owner);
};
