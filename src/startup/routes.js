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
};
