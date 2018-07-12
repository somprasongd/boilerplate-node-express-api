import pgPromise from 'pg-promise';
import winston from 'winston';
import config from '.';
import repos from '../api/repositories';

const initOptions = {
  // pg-promise initialization options...
  receive(data, result, e) {
    camelizeColumns(data);
  },
  query(e) {
    winston.info(`QUERY: ${e.query}`);
  },
  connect(client, dc, useCount) {
    console.log(client);

    const cp = client.connectionParameters;

    winston.info(`Connected to database`);
  },
  disconnect(client, dc) {
    const cp = client.connectionParameters;
    winston.info(`Disconnecting from database`);
  },
  // global event notification;
  error(error, e) {
    if (e.cn) {
      // A connection-related error;
      //
      // Connections are reported back with the password hashed,
      // for safe errors logging, without exposing passwords.
      winston.debug(`CN: ${e.cn}`);
      winston.debug(`EVENT: ${error.message || error}`);
    }
  },
  // Extending the database protocol with our custom repositories;
  extend(obj, dc) {
    obj.user = new repos.User(obj, pgp);
    obj.category = new repos.Category(obj, pgp);
    obj.owner = new repos.Owner(obj, pgp);
    obj.pet = new repos.Pet(obj, pgp);
  },
};

const camelizeColumns = data => {
  const template = data[0];
  Object.keys(template).forEach(prop => {
    const camel = pgPromise.utils.camelize(prop);
    if (!(camel in template)) {
      for (let i = 0; i < data.length; i += 1) {
        const d = data[i];
        d[camel] = d[prop];
        delete d[prop];
      }
    }
  });
};

// Load and initialize pg-promise:
const pgp = pgPromise(initOptions);

// Create the database instance:
const db = pgp(config.DB_URI);

db.connect()
  .then(obj => {
    obj.done(); // success, release the connection;
  })
  .catch(error => {
    winston.debug(`ERROR: ${error.message || error}`);
  });

db.proc('version')
  .then(data => {
    winston.debug(`PG: ${data.version}`);
  })
  .catch(error => {
    // connection-related error
    winston.debug(`ERROR: ${error.message || error}`);
  });

export default db;
