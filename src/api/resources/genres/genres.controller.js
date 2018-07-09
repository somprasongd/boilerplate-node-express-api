import { Genre, validate } from '../../models/genre';
import paginate from '../../helpers/paginate.js';

export const create = async (req, res) => {
  const { error } = validate(req.body);
  if (error) return res.status(400).send(error.details[0].message);

  let genre = new Genre({ name: req.body.name });
  genre = await genre.save();

  res.send(genre);
};

export const findAll = async (req, res) => {
  const { limit, offset, page } = req.query;
  let genres = Genre.find()
    .sort('name')
    .skip(offset)
    .limit(limit);
  let counts = Genre.count({}).exec();
  [genres, counts] = await Promise.all([genres, counts]);
  const results = paginate(genres, counts, limit, offset, page);
  res.send(results);
};

export const findOne = async (req, res) => {
  const genre = await Genre.findById(req.params.id);

  if (!genre) return res.status(404).send('The genre with the given ID was not found.');

  res.send(genre);
};

export const remove = async (req, res) => {
  const genre = await Genre.findByIdAndRemove(req.params.id);

  if (!genre) return res.status(404).send('The genre with the given ID was not found.');

  res.send(genre);
};

export const update = async (req, res) => {
  const { error } = validate(req.body);
  if (error) return res.status(400).send(error.details[0].message);

  const genre = await Genre.findByIdAndUpdate(
    req.params.id,
    { name: req.body.name },
    {
      new: true,
    }
  );

  if (!genre) return res.status(404).send('The genre with the given ID was not found.');

  res.send(genre);
};
