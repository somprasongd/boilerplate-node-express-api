import cors from 'cors';
import express from 'express';
import helmet from 'helmet';
import compression from 'compression';
import morgan from 'morgan';
import createGracefulShutdownMiddleware from 'express-graceful-shutdown';
import config from '../config';
import { accessLogStream } from '../config/logger';

export default app => {
  const { corsOptions, gracefulShutdownTimeout } = config.server;
  // use middlewares
  app.use(createGracefulShutdownMiddleware(app.get('server'), { forceTimeout: gracefulShutdownTimeout }));
  app.use(cors(corsOptions));
  if (app.get('env') === 'production') {
    app.use(helmet());
    app.use(compression());
  }
  app.use(express.json()); // parse application/json
  app.use(express.urlencoded({ extended: true })); // parse application/x-www-form-urlencoded
  if (app.get('env') === 'production') {
    // use morgan as express middleware to link winston and express
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
