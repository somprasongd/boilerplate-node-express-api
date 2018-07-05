import express from 'express';
import cors from 'cors';
import helmet from 'helmet';
import morgan from 'morgan';
import debugFn from 'debug';
import config from './config';

const app = express();

// setup debugger
const debug = debugFn('app:startup');

// use middlewares
app.use(cors(config.corsOptions));
app.use(helmet());
// app.use(helmet.hidePoweredBy()); // or use app.disable('x-powered-by');
// app.use(helmet.xssFilter({ setOnOldIE: true })); // Sets "X-XSS-Protection: 1; mode=block"., { setOnOldIE: true } This has some security problems for old IE!
app.use(express.json()); // parse application/json
app.use(express.urlencoded({ extended: true })); // parse application/x-www-form-urlencoded
// use in development mode only
if (app.get('env') === 'development') {
  app.use(morgan('tiny'));
  debug('Morgan enabled...');
}

// default route
app.get('/', (req, res) => {
  res.send('Hello Express');
});

// start server
const { port: PORT } = config;
app.listen(PORT, () => {
  debug(`Server start on port ${PORT}`)
});