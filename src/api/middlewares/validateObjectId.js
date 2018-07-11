import mongoose from 'mongoose';

export default (req, res, next) => {
  if (!mongoose.Types.ObjectId.isValid(req.params.id)) {
    return res.status(400).json({ error: { message: 'Invalid ID.' } });
  }

  next();
};
