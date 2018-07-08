import express from 'express';
import fs from 'fs';
import path from 'path';
import Joi from 'joi';
import joiObjectId from 'joi-objectid';

// create Joi.objectId() to validate mongodb OjectId
Joi.objectId = joiObjectId(Joi);

export const apiRouter = express.Router()

const PATH = path.join(__dirname, 'resources');
fs
  .readdirSync(PATH)
  .filter((file) => {
    return (file.indexOf('.') !== 0) && (file !== 'index.js')
  })
  .forEach((feature) => {
    const { router } = require(path.join(PATH, `${feature}/index.js`))
    apiRouter.use(`/${feature}`, router)
  })