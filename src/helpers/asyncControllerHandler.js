// if module 'express-async-errors' does't work use this
export default handler => async (req, res, next) => {
  try {
    await handler(req, res);
  } catch (ex) {
    next(ex);
  }
};
