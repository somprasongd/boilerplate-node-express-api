import pgPromise from 'pg-promise';
import winston from 'winston';
import config from '.';
import repos from '../api/repos';

const initOptions = {
  // pg-promise initialization options...
  receive(data, result, e) {
    camelizeColumns(data);
  },
  query(e) {
    winston.info(`QUERY: ${e.query}`);
  },
  connect(client, dc, useCount) {
    const cp = client.connectionParameters;
    winston.info(`Connected to database: ${cp.database}`);
  },
  disconnect(client, dc) {
    const cp = client.connectionParameters;
    winston.info(`Disconnecting from database: ${cp.database}`);
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
  for (const prop in template) {
    const camel = pgPromise.utils.camelize(prop);
    if (!(camel in template)) {
      for (let i = 0; i < data.length; i++) {
        const d = data[i];
        d[camel] = d[prop];
        delete d[prop];
      }
    }
  }
};

// Load and initialize pg-promise:
const pgp = pgPromise(initOptions);

// Create the database instance:
const db = pgp(config.DB_URI);

export default db;
