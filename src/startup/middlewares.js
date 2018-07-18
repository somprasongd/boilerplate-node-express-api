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
  app.use(express.json()); // parse application/json
  app.use(express.urlencoded({ extended: true })); // parse application/x-www-form-urlencoded
  if (app.get('env') === 'development') {
    app.use(morgan('dev'));
  }

  // Express behind proxies
  app.set('trust proxy', 'loopback');

  app.use((req, res, next) => {
    req.getHost = function() {
      return `${req.protocol}://${req.get('host')}`;
    };
    req.getUrl = function() {
      return `${req.protocol}://${req.get('host')}${req.originalUrl}`;
    };
    next();
  });
};
