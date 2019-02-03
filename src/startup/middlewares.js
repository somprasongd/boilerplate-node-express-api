import cors from 'cors';
import express from 'express';
import helmet from 'helmet';
import morgan from 'morgan';
import createGracefulShutdownMiddleware from 'express-graceful-shutdown';
import config from '../config';
import { accessLogStream } from '../config/logging';

export default app => {
  // use middlewares
  app.use(createGracefulShutdownMiddleware(app.get('server'), { forceTimeout: 30000 }));
  app.use(cors(config.CORS_OPTIONS));
  if (app.get('env') === 'production') {
    app.use(helmet());
  }
  app.use(express.json()); // parse application/json
  app.use(express.urlencoded({ extended: true })); // parse application/x-www-form-urlencoded
  if (app.get('env') === 'production') {
    app.use(morgan('combined', { stream: accessLogStream }));
    // log only 4xx and 5xx responses to console
    app.use(
      morgan('short', {
        skip(req, res) {
          return res.statusCode < 400;
        },
      })
    );
  } else {
    app.use(morgan('dev'));
  }
};
