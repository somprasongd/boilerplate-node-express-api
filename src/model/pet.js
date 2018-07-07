import mongoose from 'mongoose';
import mongoosePaginate from 'mongoose-paginate';

const { Schema } = mongoose;
const petSchema = new Schema({
  name: {
    type: String,
    required: [true, 'Pet must have name'],
  },
  breed: {
    type: String,
    required: [true, 'Pet must have breed'],
  },
  age: {
    type: Number,
    default: 0,
    min: 0,
    max: 20,
  },
  // owner: {
  //   type: mongoose.Schema.Types.ObjectId,
  //   ref: 'User',
  //   required: true,
  // },
});
petSchema.plugin(mongoosePaginate);
export default mongoose.model('Pet', petSchema);