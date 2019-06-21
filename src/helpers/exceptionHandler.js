export const invalidExceptionHandler = message => {
  const err = new Error(message);
  err.status = 400;
  throw err;
};

export const notFoundExceptionHandler = message => {
  const err = new Error(message);
  err.status = 404;
  throw err;
};
