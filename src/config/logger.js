import fs from 'fs';
import path from 'path';
import rfs from 'rotating-file-stream';
import winston from 'winston';

const logDirectory = 'logs';

// ensure log directory exists
if (!fs.existsSync(logDirectory)) {
  fs.mkdirSync(logDirectory);
}

export default app => {
  // handle unhandled rejection
  process.on('unhandledRejection', ex => {
    throw ex;
  });

  winston.exitOnError = false;

  if (app.get('env') !== 'production') {
    return winston.add(
      new winston.transports.Console({
        level: 'debug',
        handleExceptions: true,
        humanReadableUnhandledException: true,
        format: winston.format.combine(winston.format.colorize(), winston.format.simple()),
      })
    );
  }

  // handle uncaught exception
  winston.exceptions.handle(
    new winston.transports.File({
      filename: path.join(logDirectory, 'uncaughtExceptions.log'),
      format: winston.format.json(),
    })
  );

  // Write all logs error (and below) to `error.log`.
  winston.add(
    new winston.transports.File({
      level: 'error',
      filename: path.join(logDirectory, 'error.log'),
      handleExceptions: false,
      format: winston.format.json(),
      maxsize: 5242880, // 5MB
      maxFiles: 5,
      colorize: false,
    })
  );

  // Write to all logs with level `info` and below to `combined.log`
  winston.add(
    new winston.transports.File({
      level: 'info',
      filename: path.join(logDirectory, 'combined.log'),
      handleExceptions: false,
      format: winston.format.prettyPrint(),
      maxsize: 5242880, // 5MB
      maxFiles: 5,
      colorize: false,
    })
  );

  //  Write all logs error (and below) to console
  winston.add(
    new winston.transports.Console({
      level: 'info',
      handleExceptions: true,
      humanReadableUnhandledException: true,
      format: winston.format.combine(winston.format.colorize(), winston.format.simple()),
    })
  );
};

export const accessLogStream = rfs('access.log', {
  interval: '1d', // rotate daily
  path: logDirectory,
});
