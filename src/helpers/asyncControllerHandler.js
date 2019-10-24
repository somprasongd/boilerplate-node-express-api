// if module 'express-async-errors' does't work use this
export default fn => async (req, res, next) => {
  try {
    await fn(req, res, next);
  } catch (ex) {
    next(ex);
  }
};

// Promise style
// export default fn => (req, res, next) => {
//   Promise.resolve(fn(req, res, next)).catch(next);
// };
