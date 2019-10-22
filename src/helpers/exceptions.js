class Exceptions extends Error {
  constructor(statusCode, message) {
    super(message);

    this.statusCode = statusCode;
    this.status = `${statusCode}`.startsWith('4') ? 'fail' : 'error';
    this.isOperational = true;

    Error.captureStackTrace(this, this.constructor);
  }
}

class InvalidExceptions extends Exceptions {
  constructor(message) {
    super(400, message);
  }
}

class NotFoundExceptions extends Exceptions {
  constructor(message) {
    super(404, message);
  }
}

class UnhandledExceptions extends Exceptions {
  constructor(message) {
    super(500, message);
  }
}

export { Exceptions, InvalidExceptions, NotFoundExceptions, UnhandledExceptions };
