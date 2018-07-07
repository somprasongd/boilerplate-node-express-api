import winston from 'winston';

export default (app) => {

  // handle uncaught exception
  // process.on('uncaughtException', (ex) => {
  //   console.log('WE GOT AN UNCAUGHT EXCEPTION');
  //   winston.error(ex.message, ex);
  // });

  // handle unhandled rejection
  process.on('unhandledRejection', (ex) => {
    // console.log('WE GOT AN UNHANDLED REJECTION');
    throw ex;
  });

  winston.exitOnError = false;

  if (app.get('env') === 'production') {
    // handle uncaught exception
    winston.exceptions.handle(
      new winston.transports.File({
        filename: 'logs/uncaughtExceptions.log',
        format: winston.format.json(),
      })
    );

    // Write all logs error (and below) to `error.log`.
    winston.add(new winston.transports.File({
      level: 'error',
      filename: `logs/error.log`,
      handleExceptions: false,
      format: winston.format.json(),
      maxsize: 5242880, // 5MB
      maxFiles: 5,
      colorize: false,
    }));

    // Write to all logs with level `info` and below to `combined.log` 
    winston.add(new winston.transports.File({
      level: 'info',
      filename: `logs/combined.log`,
      handleExceptions: false,
      format: winston.format.json(),
      maxsize: 5242880, // 5MB
      maxFiles: 5,
      colorize: false,
    }));

    //  Write all logs error (and below) to console
    winston.add(new winston.transports.Console({
      level: 'error',
      handleExceptions: true,
      format: winston.format.combine(
        winston.format.colorize(),
        winston.format.simple()
      )
    }));
    return;
  }

  // If we're not in production then log to the `console` with the format:
  // `${info.level}: ${info.message} JSON.stringify({ ...rest }) `
  winston.add(new winston.transports.Console({
    level: 'debug',
    handleExceptions: true,
    format: winston.format.combine(
      winston.format.colorize(),
      winston.format.simple()
    )
  }));
}