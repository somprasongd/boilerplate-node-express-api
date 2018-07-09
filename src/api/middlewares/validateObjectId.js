export default (req, res, next) => {
  const reg = new RegExp('^[0-9]+$');
  if (!reg.test(req.params.id)) return res.status(404).send('Invalid ID.');
  next();
};
