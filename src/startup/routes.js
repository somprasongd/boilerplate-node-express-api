import 'express-async-errors';
import winston from 'winston';
import swaggerUi from 'swagger-ui-express';
import swaggerDocument from '../doc/swagger.json';
import { apiRouter } from '../api';

export default app => {
  // home
  app.get('/', (req, res) => {
    res.send('OK');
  });
  // api
  app.use('/api', apiRouter);

  // documentation with swagger in dev mode only
  if (app.get('env') === 'development') {
    app.use(
      '/api-docs',
      swaggerUi.serve,
      swaggerUi.setup(swaggerDocument, {
        explorer: true,
      })
    );
  }

  // handle 404
  app.use((req, res, next) => {
    const error = new Error();
    error.message = 'Invalid route';
    error.status = 404;
    next(error);
  });

  // handle error
  app.use((error, req, res, next) => {
    const status = error.status || 500;
    // Log the exception
    winston.error(`${status} - ${error.message} - ${req.originalUrl} - ${req.method} - ${req.ip}`);
    if (status === 500 && app.get('env') === 'development') {
      console.log(error);
    }
    return res.status(status).json({
      error: {
        status,
        message: error.message,
      },
    });
  });
};
