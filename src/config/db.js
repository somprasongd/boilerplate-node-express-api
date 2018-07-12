import pgPromise from 'pg-promise';
import winston from 'winston';
import config from '.';
import repos from '../api/repositories';

// pg-promise initialization options...
const initOptions = {
  receive(data, result, e) {
    // convert column from xxx_yy to xxxYy
    camelizeColumns(data);
  },
  query(e) {
    // show SQL to console
    winston.info(`QUERY: ${e.query}`);
  },
  connect(client, dc, useCount) {
    // const cp = client.connectionParameters;
    winston.info(`Connected to database`);
  },
  disconnect(client, dc) {
    // const cp = client.connectionParameters;
    winston.info(`Disconnecting from database`);
  },
  error(error, e) {
    if (e.cn) {
      // A connection-related error;
      winston.debug(`CN: ${e.cn}`);
      winston.debug(`EVENT: ${error.message || error}`);
    }
  },
  extend(obj, dc) {
    // Extending the database protocol with our custom repositories;
    obj.users = new repos.UsersRepository(obj, pgp);
    obj.categories = new repos.CategoriesRepository(obj, pgp);
    obj.owners = new repos.OwnersRepository(obj, pgp);
    obj.pets = new repos.PetsRepository(obj, pgp);
  },
};

const camelizeColumns = data => {
  const template = data[0];
  if (!template) return;
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

// Test db connection.
export const testConnection = async () => {
  db.connect()
    .then(obj => {
      winston.debug(`PG: Connected.`);
      obj.done(); // success, release the connection;
    })
    .catch(error => {
      throw error;
    });

  // Show PostgreSQL version after connected.
  db.proc('version')
    .then(data => {
      winston.debug(`PG: ${data.version}`);
    })
    .catch(error => {
      throw error;
    });
};

export default db;
