import express from 'express';
import winston from 'winston';
import startup from './startup';
import config from './config';

const { PORT } = config;
const app = express();

startup(app);

// start server
app.listen(PORT, () => {
  winston.info(`Server start on port ${PORT}`);
});
