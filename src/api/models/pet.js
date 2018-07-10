import Joi from 'joi';
import mongoose from 'mongoose';
import { categorySchema } from './category';

const petSchema = new mongoose.Schema({
  name: {
    type: String,
    required: [true, 'Pet must have name'],
    minlength: 2,
    maxlength: 50,
    // match: /pattern/
  },
  category: {
    type: categorySchema,
    required: true,
  },
  breed: {
    type: String,
    required: [true, 'Pet must have breed'],
  },
  age: {
    type: String,
    required: [true, 'Pet must have age in ["baby", "young", "adult", "senior"]'],
    enum: ['baby', 'young', 'adult', 'senior'],
    lowercase: true,
    // uppercase: true,
    trim: true,
  },
  created_on: {
    type: Date,
    default: Date.now(),
  },
  ownerId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true,
  },
});

const Pet = mongoose.model('Pet', petSchema);

function validatePet(pet) {
  const schema = Joi.object().keys({
    name: Joi.string()
      .min(2)
      .max(50)
      .required(),
    categoryId: Joi.objectId().required(),
    breed: Joi.string().required(),
    age: Joi.string().required(),
    ownerId: Joi.objectId().required(),
  });
  return Joi.validate(pet, schema);
}

export { Pet, validatePet as validate };
