import 'express-async-errors';
import swaggerUi from 'swagger-ui-express';
import winston from 'winston';
import swaggerDocument from '../config/swagger.json';
import { apiRouter } from '../api';

export default (app) => {

  // api
  app.use('/api', apiRouter);

  // documentation with swagger
  app.use(
    '/',
    swaggerUi.serve,
    swaggerUi.setup(swaggerDocument, {
      explorer: true,
    })
  );

  // handle 404
  app.use((req, res, next) => {
    const error = new Error('Not found');
    error.message = 'Invalid route';
    error.status = 404;
    next(error);
  });

  // handle error
  app.use((error, req, res, next) => {
    // Log the exception
    winston.error(error.message, error);
    res.status(error.status || 500);
    return res.json({
      error: {
        message: error.message,
      },
    });
  });
}