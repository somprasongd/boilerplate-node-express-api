import cors from 'cors';
import express from 'express';
import helmet from 'helmet';
import morgan from 'morgan';
import config from '../config';

export default app => {
  // use middlewares
  app.use(cors(config.corsOptions));
  if (app.get('env') === 'production') {
    app.use(helmet());
  }
  // use only application/json
  app.use(express.json());
  if (app.get('env') === 'development') {
    app.use(morgan('dev'));
  }
};
