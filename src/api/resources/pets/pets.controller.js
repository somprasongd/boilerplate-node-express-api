import petService from './pets.service';
import Pet from '../../models/demo-pet-pagination';

export default {
  async create(req, res) {
    const { value, error } = petService.validateBody(req.body);
    if (error) {
      return res.status(400).json(error);
    }
    const pet = await Pet.create(value); // (Object.assign({}, value, { onwer: req.user._id }));
    return res.json(pet);
  },
  async findAll(req, res) {
    const { page, perPage } = req.query;
    const options = {
      page: parseInt(page, 10) || 1,
      limit: parseInt(perPage, 10) || 10,
      // populate: {
      //   path: 'onwer',
      //   select: 'firstName lastName',
      // },
    };
    const pets = await Pet.paginate({}, options);
    return res.json(pets);
  },
  async findOne(req, res) {
    const { id } = req.params;
    const pet = await Pet.findById(id); // .populate('artist', 'firstName lastName');
    if (!pet) {
      return res.status(404).json({ err: 'could not find pet' });
    }
    return res.json(pet);
  },
  async delete(req, res) {
    const { id } = req.params;
    const pet = await Pet.findOneAndRemove({ _id: id });
    if (!pet) {
      return res.status(404).json({ err: 'could not find pet' });
    }
    return res.json(pet);
  },
  async update(req, res) {
    const { id } = req.params;
    const { value, error } = petService.validateBody(req.body);
    if (error) {
      return res.status(400).json(error);
    }
    const pet = await Pet.findOneAndUpdate({ _id: id }, value, { new: true });
    if (!pet) {
      return res.status(404).json({ err: 'could not find pet' });
    }
    return res.json(pet);
  },
};
