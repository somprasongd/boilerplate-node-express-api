import express from 'express';
import http from 'http';
import winston from 'winston';
import startup from './startup';
import config from './config';
import startupEvents from './helpers/startup-events';

const app = express();
const server = http.Server(app);

app.set('server', server);

startup(app);

// start server
startupEvents.once('db-connected', () => {
  server.listen(config.server.port, () => {
    winston.info(`Server start on port ${server.address().port}`);
  });
});
