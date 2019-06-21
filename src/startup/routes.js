import 'express-async-errors';
import swaggerUi from 'swagger-ui-express';
import swaggerDocument from '../doc/swagger.json';
import { apiRouter } from '../api';
import logger from '../logger';
import { notFoundExceptionHandler } from '../helpers/exceptionHandler';

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
    notFoundExceptionHandler('Invalid route');
  });

  // handle error
  app.use((error, req, res, next) => {
    const status = error.status || 500;
    // Log the exception
    const message = `${status} - ${error.message} - ${req.originalUrl} - ${req.method} - ${req.ip}`;
    logger.error(new Error(message));
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
