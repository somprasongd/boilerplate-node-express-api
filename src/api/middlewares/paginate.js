import Joi from 'joi';
import config from '../../config';

export default (req, res, next) => {
  const { error } = validate(req.query);
  if (error) return res.status(400).json({ error: { message: error.details[0].message } });

  req.query.limit = req.query.hasOwnProperty('limit') ? +req.query.limit : config.PAGE_LIMIT;
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

function validate(req) {
  const schema = {
    limit: Joi.number()
      .min(1)
      .optional(),
    offset: Joi.number()
      .min(0)
      .optional(),
    page: Joi.number()
      .min(1)
      .optional(),
  };

  return Joi.validate(req, schema);
}
