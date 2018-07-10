import Joi from 'joi';
import mongoose from 'mongoose';

const Owner = mongoose.model(
  'Owner',
  new mongoose.Schema({
    name: {
      type: String,
      required: true,
      minlength: 5,
      maxlength: 50,
    },
    phone: {
      type: String,
      minlength: 9,
      maxlength: 10,
    },
    petCount: {
      type: Number,
      default: 0,
      min: 0,
    },
  })
);

function validateOwner(owner) {
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

export { Owner, validateOwner as validate };
