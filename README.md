# Example with mongoose

Use pg-promise to connect PostgreSQL

## Folder Structure

```bash
./
----/dist # distributed source code
----/logs # collect log files in production mode
----/src # development source code
--------/api # api routes
------------controllers # handler functions for each route to handle req, res
------------helpers # helper functions
------------middlewares # routes middlewares such as authorization middlware
------------repositories # manage SQL each table
------------routes # api routes, use file name to api URI (/api/[filename])
------------index.js # export all router (express.Router())
--------/config # config variables
------------db.js # connect to database
------------development.js # config in dev mode
------------index.js # export this module with match environtment
------------production.js # config in prod mode
--------/doc # api document
------------swagger.json # swagger config file
--------/startup # startup app module
------------config.js # validate config variables, if not have exit app
------------index.js # export this module
------------logging.js # config winston log
------------middlewares.js # handle express middlewares
------------routes.js # handle route for http req, res
--------index.js # main app
----.babelrc # babel config file
----.env # set system environtments in this file, it will load to process.env
----.eslintignore # use to ignore lint such as /dist
----.eslintrc.js #  eslint config file
----.gitignore
----package.json
```

- Or use this style.

```bash
./
----/src # development source code
--------/api # api routes
------------helpers # helper functions
------------middlewares # routes middlewares such as authorization middlware
------------resources # api routes, use directory name to api URI (/api/[dirname])
----------------routes1 # /api/routes1
--------------------index.js # export router in routes1.router.js
--------------------routes1.controllers.js # handler functions for each route to handle req, res
--------------------routes1.repository.js # handler SQL from controller
--------------------routes1.router.js # handler router for /api/routes1
----------------routes2 # /api/routes2
--------------------index.js # export router in routes2.router.js
--------------------routes2.controllers.js # handler functions for each route to handle req, res
--------------------routes2.repository.js # handler SQL from controller
--------------------routes2.router.js # handler router for /api/routes2
------------index.js # export all router (express.Router())
```

_Remark: this style must change routers loader from file name to dir name_

```javascript
// ./src/api/index.js
const PATH = path.join(__dirname, "resources");
fs.readdirSync(PATH)
  .filter(file => file.indexOf(".") !== 0 && file !== "index.js")
  .forEach(feature => {
    // load from /api/resources/[feature]/index
    const { router } = require(path.join(PATH, `${feature}`));
    apiRouter.use(`/${feature}`, router);
  });
```

## How to connect DB

### Step 1: Config DB_URI

- In dev mode config in `./src/config/development.js`

```javascript
export default {
  DB_URI: "postgres://postgres:postgres@localhost:5432/demo"
};
```

- In production mode set environtment to `appName_DB_URI`

### Step 2: Connect to MongoDB

- Install pg-promise: `npm i -S pg-promise`

- Open file `./src/config/db.js` and write code like this:

```javascript
// ./src/config/db.js
import pgPromise from "pg-promise";
import winston from "winston";
import config from ".";
import repos from "../api/repositories";

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
  }
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
  db.proc("version")
    .then(data => {
      winston.debug(`PG: ${data.version}`);
    })
    .catch(error => {
      throw error;
    });
};

export default db;
```

### Step 3: Create Repositories

- Example create `PetsRepository` in `./src/api/repositories/pets.js`.

```javascript
// ./src/api/repositories/pet.js
import Repository from "../helpers/repository";

export default class PetsRepository extends Repository {
  constructor(db, pgp) {
    // pets is table name in database
    // {categoryId: "category_id", ownerId: "owner_id"} is key map
    // categoryId is property name in json must convert to cloumn name (category_id) in database before execute.
    super(db, pgp, "pets", {
      categoryId: "category_id",
      ownerId: "owner_id"
    });
  }
}
```

### Step 4: Create CRUD API

- Design

```
POST   /api/pets { name, category, breed, age, tags } -- create new pet with auth
GET    /api/pets -- get all pets with auth

GET    /api/pets/:id -- get pet by id with auth, validate ObjectId
PUT    /api/pets/:id { name, category, breed, age, tags } -- update pet by id with auth, validate ObjectId
DELETE /api/pets/:id -- delete pet by id with auth, validate ObjectId
```

- Create new file `./src/api/routes/pets.js`

```javascript
// ./src/api/routes/pets.js
import express from "express";
import * as controller from "../controllers/pets";
import auth from "../middlewares/auth"; // use for auth with JWT
import paginate from "../middlewares/paginate"; // use for paginations
import validateObjectId from "../middlewares/validateObjectId"; // use for validate id format

export const router = express.Router();

router
  .route("/")
  .post(auth, controller.create)
  .get([auth, paginate], controller.findAll);

router
  .route("/:id")
  .get([auth, validateObjectId], controller.findOne)
  .delete([auth, validateObjectId], controller.remove)
  .put([auth, validateObjectId], controller.update);
```

### Step 5: Create controller

- Create new file `./src/api/controllers/pets.js`

```javascript
// ./src/api/controllers/pets.js
import Joi from "joi";
import db from "../../config/db";
import paginate from "../helpers/paginate.js";

export const create = async (req, res) => {
  const schema = Joi.object().keys({
    name: Joi.string()
      .min(2)
      .max(50)
      .required(),
    categoryId: Joi.number().required(),
    breed: Joi.string().required(),
    age: Joi.string().required(),
    ownerId: Joi.number().required()
  });
  const { error, value } = Joi.validate(req.body, schema);
  if (error)
    return res
      .status(400)
      .json({ error: { message: error.details[0].message } });

  const pet = {
    name: value.name,
    breed: value.breed,
    age: value.age,
    category_id: value.categoryId,
    owner_id: value.ownerId
  };

  // use transactions
  const result = await db.tx(async t => {
    const data = await t.pets.create(pet);
    await t.owners.incPetCount(pet.owner_id);
    return data;
  });

  res.send(result);
};

export const findAll = async (req, res) => {
  const { limit, offset, page } = req.query;
  // task use for make multiple sql in same connection.
  const { datas, counts } = await db.task(async t => {
    const p1 = t.manyOrNone(
      "select * from pets offset $<offset> limit $<limit>",
      {
        offset,
        limit
      }
    );
    const p2 = t.one("SELECT count(*) FROM pets", [], a => +a.count);
    const [datas, counts] = await Promise.all([p1, p2]);
    return { datas, counts };
  });

  const results = paginate(datas, counts, limit, offset, page);
  res.send(results);
};

export const findOne = async (req, res) => {
  const pet = await db.pets.findById(req.params.id);

  if (!pet)
    return res
      .status(404)
      .json({ error: { message: "The pet with the given ID was not found." } });

  res.send(pet);
};

export const remove = async (req, res) => {
  const pet = await db.pets.remove(req.params.id);

  if (!pet)
    return res
      .status(404)
      .json({ error: { message: "The pet with the given ID was not found." } });

  res.status(204).end();
};

export const update = async (req, res) => {
  const schema = {
    name: Joi.string()
      .min(2)
      .max(50)
      .optional(),
    categoryId: Joi.number().optional(),
    breed: Joi.string().optional(),
    age: Joi.string().optional(),
    ownerId: Joi.number().optional()
  };

  const { error, value } = Joi.validate(req.body, schema);
  if (error)
    return res
      .status(400)
      .json({ error: { message: error.details[0].message } });

  const pet = await db.pets.update(req.params.id, value);
  if (!pet)
    return res
      .status(404)
      .json({ error: { message: "The pet with the given ID was not found." } });

  res.send(pet);
};
```
