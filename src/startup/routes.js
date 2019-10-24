import 'express-async-errors';
import swaggerUi from 'swagger-ui-express';
import swaggerDocument from '../doc/swagger.json';
import { apiRouter } from '../api';
import errorControllerHandler from '../helpers/errorControllerHandler';
import { NotFoundExceptions } from '../helpers/exceptions.js';

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

  // health check
  app.get('/health', (req, res) => res.status(200).end());

  // handle 404 route
  app.use((req, res, next) => {
    next(new NotFoundExceptions(`Can not find ${req.originalUrl} on this server!`));
  });

  // handle error
  app.use(errorControllerHandler);
};
