import Fawn from 'fawn';
import mongoose from 'mongoose';
import winston from 'winston';
import config from '../config';

export default () => {
  mongoose
    .connect(
      config.DB_URI,
      { useNewUrlParser: true }
    )
    .then(() => winston.info('Connected to MongoDB...'));

  Fawn.init(mongoose);
};
