import mongoose from 'mongoose';
import mongoosePaginate from 'mongoose-paginate';

const { Schema } = mongoose;
const petSchema = new Schema({
  name: {
    type: String,
    required: [true, 'Pet must have name'],
    minlength: 2,
    maxlength: 255,
    // match: /pattern/
  },
  category: {
    type: String,
    required: [true, 'Pet must have category in ["bird", "cat", "dog", "other"]'],
    enum: ['bird', 'cat', 'dog', 'other'],
    lowercase: true,
    // uppercase: true,
    trim: true,
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
  tags: {
    type: Array,
    validate: {
      validator: function (v) {
        return v && v.length > 0;
      },
      message: 'A pet should have at least one tag.'
    },    
  },
  isAlive: {
    type: Boolean,
    default: true,
  },
  isLost: {
    type: Boolean,
    default: false,
  },
  prize: {
    type: Number,
    required: function () {
      return this.isLost;
    },
    min: 0,
    max: 200000,
    get: v => Math.round(v),
    set: v => Math.round(v),
  },
  date: {
    type: Date,
    default: Date.now()
  }
  // owner: {
  //   type: mongoose.Schema.Types.ObjectId,
  //   ref: 'User',
  //   required: true,
  // },
});
petSchema.plugin(mongoosePaginate);
export default mongoose.model('Pet', petSchema);