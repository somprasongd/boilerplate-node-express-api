import express from 'express';
import fs from 'fs';
import path from 'path';
import Joi from 'joi';
import joiObjectId from 'joi-objectid';

// create Joi.objectId() to validate mongodb OjectId
Joi.objectId = joiObjectId(Joi);

export const apiRouter = express.Router();

const PATH = path.join(__dirname, 'routes');
fs.readdirSync(PATH)
  .filter(file => file.indexOf('.') !== 0 && file !== 'index.js')
  .forEach(feature => {
    const route = feature.substring(0, feature.indexOf('.'));
    const { router } = require(path.join(PATH, `${route}`));
    apiRouter.use(`/${route}`, router);
  });
