import 'express-async-errors';
import winston from 'winston';

export default app => {
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
