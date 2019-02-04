import Joi from 'joi';
import config from '../../config';

export default (req, res, next) => {
  const schema = {
    limit: Joi.number().min(1),
    offset: Joi.number().min(0),
    page: Joi.number().min(1),
  };
  const { error, value } = Joi.validate(req.query, schema, { allowUnknown: true });
  if (error) return res.status(400).json({ error: { message: error.details[0].message } });

  const { limit, offset, page } = value;

  req.query.limit = req.query.hasOwnProperty('limit') ? limit : config.api.pageLimit;
  if (req.query.hasOwnProperty('offset')) {
    req.query.offset = offset;
    req.query.page = undefined;
  } else if (req.query.hasOwnProperty('page')) {
    req.query.page = page;
    req.query.offset = (page - 1) * req.query.limit;
  } else {
    req.query.offset = 0;
    req.query.page = 1;
  }
  next();
};
