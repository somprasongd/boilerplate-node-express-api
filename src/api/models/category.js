import Joi from 'joi';
import mongoose from 'mongoose';

const categorySchema = new mongoose.Schema({
  name: {
    type: String,
    required: true,
    maxlength: 50,
  },
});

const Category = mongoose.model('Category', categorySchema);

function validateCategory(category) {
  const schema = {
    name: Joi.string()
      .max(50)
      .required(),
  };

  return Joi.validate(category, schema);
}

export { categorySchema, Category, validateCategory as validate };
