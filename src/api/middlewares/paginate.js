export default (req, res, next) => {
  req.query.limit = req.query.hasOwnProperty('limit') ? +req.query.limit : 10;
  if (req.query.hasOwnProperty('offset')) {
    req.query.offset = +req.query.offset;
    req.query.page = undefined;
  } else if (req.query.hasOwnProperty('page')) {
    req.query.page = +req.query.page;
    req.query.offset = (req.query.page - 1) * req.query.limit;
  } else {
    req.query.offset = 0;
    req.query.page = 1;
  }
  next();
};
