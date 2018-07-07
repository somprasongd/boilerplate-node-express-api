import express from 'express';
import fs from 'fs';
import path from 'path';

export const apiRouter = express.Router()

const PATH = path.join(__dirname, 'resources');
fs
  .readdirSync(PATH)
  .filter((file) => {
    // fs.statSync(path.join(__dirname, file)).isDirectory()
    return (file.indexOf('.') !== 0) && (file !== 'index.js')
  })
  .forEach((feature) => {
    const { router } = require(path.join(PATH, `${feature}/index.js`))
    apiRouter.use(`/${feature}`, router)
  })