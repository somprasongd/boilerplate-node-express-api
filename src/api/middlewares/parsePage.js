import Joi from 'joi';
import config from '../../config';

export default (req, res, next) => {
  const { error, value } = validate(req.query);
  if (error) return res.status(400).json({ error: { message: error.details[0].message } });

  const { limit, offset, page } = value;

  req.query.limit = req.query.hasOwnProperty('limit') ? limit : config.PAGE_LIMIT;
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

function validate(req) {
  const schema = {
    limit: Joi.number().min(1),
    offset: Joi.number().min(0),
    page: Joi.number().min(1),
  };

  return Joi.validate(req, schema, { allowUnknown: true });
}
