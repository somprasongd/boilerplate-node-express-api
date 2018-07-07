// if module 'express-async-errors' does't work use this
export default (handler) => {
  return async (req, res, next) => {
    try {
      await handler(req, res);
    } catch (ex) {
      next(ex);
    }
  }
}