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
        filename: 'logs/uncaughtExceptions.log'
      })
    );

    winston.add(new winston.transports.File({
      level: 'info',
      filename: `logs/app.log`,
      handleExceptions: true,
      json: true,
      maxsize: 5242880, // 5MB
      maxFiles: 5,
      colorize: false,
    }));
    return;
  }

  winston.add(new winston.transports.Console({
    level: 'debug',
    handleExceptions: true,
    json: false,
    colorize: true,
    prettyPrint: true,
  }));
}