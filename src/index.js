import express from 'express';
import http from 'http';
import config from './config';
import logger from './logger';
import startup from './startup';
import startupEvents from './helpers/startup-events';

const app = express();
const server = http.Server(app);

app.set('server', server);

startup(app);

// start server
startupEvents.once('db-connected', () => {
  server.listen(config.server.port, () => {
    logger.info(`Server start on port ${server.address().port}`);
  });
});
