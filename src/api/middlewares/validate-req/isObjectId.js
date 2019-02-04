export default (req, res, next) => {
  const reg = new RegExp('^[0-9]+$');
  if (!reg.test(req.params.id)) {
    const err = new Error('Invalid ID.');
    err.status = 400;
    return next(err);
  }
  next();
};
