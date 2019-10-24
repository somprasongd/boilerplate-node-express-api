import { InvalidExceptions } from './exceptions';
import logger from '../logger';

// Mongoose bad ObjectId
const handleCastErrorDB = err => {
  const message = `Invalid ${err.path}: ${err.value}.`;
  return new InvalidExceptions(message);
};

const handleDuplicateFieldsDB = err => {
  const value = err.errmsg.match(/(["'])(\\?.)*?\1/)[0];
  console.log(value);

  const message = `Duplicate field value: ${value}. Please use another value!`;
  return new InvalidExceptions(message);
};

const handleValidationErrorDB = err => {
  const errors = Object.values(err.errors).map(el => el.message);

  const message = `Invalid input data. ${errors.join('. ')}`;
  return new InvalidExceptions(message);
};

const sendErrorDev = (err, res) => {
  // Log to console for dev
  console.log(err.stack);

  res.status(err.statusCode).json({
    status: err.status,
    error: err,
    message: err.message,
    stack: err.stack,
  });
};

const sendErrorProd = (err, res) => {
  // Operational, trusted error: send message to client
  if (err.isOperational) {
    res.status(err.statusCode).json({
      status: err.status,
      message: err.message,
    });

    // Programming or other unknown error: don't leak error details
  } else {
    // 1) Log error
    logger.error(err);

    // 2) Send generic message
    res.status(500).json({
      status: 'error',
      message: 'Server Error',
    });
  }
};

export default (err, req, res, next) => {
  const error = { ...err };

  error.statusCode = error.statusCode || 500;
  error.status = error.status || 'error';
  error.message = error.message || 'Server Error';

  const env = process.env.NODE_ENV || 'development';
  if (env === 'development') {
    sendErrorDev(error, res);
  } else if (env === 'production') {
    // handle mongoose error
    // if (error.name === 'CastError') error = handleCastErrorDB(error);
    // if (error.code === 11000) error = handleDuplicateFieldsDB(error);
    // if (error.name === 'ValidationError')
    //   error = handleValidationErrorDB(error);

    sendErrorProd(error, res);
  }
};
