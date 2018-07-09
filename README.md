# boilerplate-node-express-api

Boilerplate APIs with express

## How to connect DB

### Step 1: Config DB_URI

- In dev mode config in `./src/config/development.js`

```javascript
export default {
  // connect to mongodb
  DB_URI: "mongodb://username:password@host:port/database"
  // or connect to postgresql
  // DB_URL: 'postgres://username:password@host:port/database'
};
```

- In production mode set environtment to `appName_DB_URI`

### Step 2: Connect to Database

- Install package such as `mongoose` or `pg-promise`: `npm i -S mongoose`

- Open file `./src/startup/db.js` and insert code following package document that you used:

```javascript
// ./src/startup/db.js
// import package here
import winston from "winston";
import config from "../config";

export default () => {
  // add connection code here
  // connect to config.DB_URI
  // log status with winston
};
```

### Step 3: Create Model

- Create new model in `./src/api/models`, if have ORM

### Step 4: Create CRUD API

- Design

```
POST   /api/pets { name, category, breed, age, tags } -- create new pet with auth
GET    /api/pets -- get all pets by everyone

GET    /api/pets/:id -- get pet by id with auth, validate ObjectId
PUT    /api/pets/:id { name, category, breed, age, tags } -- update pet by id with auth, validate ObjectId
DELETE /api/pets/:id -- delete pet by id with auth, validate ObjectId
```

- Create new file `./src/api/routes/examples.js`

```javascript
// ./src/api/routes/examples.js
import express from "express";
import Joi from "joi";
import * as controller from "../controllers/examples";
import auth from "../middlewares/auth"; // use for auth with JWT
import paginate from "../middlewares/paginate"; // use for paginations
import validate from "../middlewares/validate"; // use for need to validate body
import validateObjectId from "../middlewares/validateObjectId"; // use for validate id format

export const router = express.Router();

router
  .route("/")
  .post([auth, validate(validateBody)], controller.create)
  .get(paginate, controller.findAll);

router
  .route("/:id")
  .get([auth, validateObjectId], controller.findOne)
  .delete([auth, validateObjectId], controller.delete)
  .put([[auth, validate(validateBody)], validateObjectId], controller.update);

function validateBody(body) {
  const schema = Joi.object().keys({
    field1: Joi.string().required(),
    field2: Joi.string().required()
  });
  const { value, error } = Joi.validate(body, schema);
  if (error && error.details) {
    return { error };
  }
  return { value };
}
```

### Step 5: Create controller

- Create new file `./src/api/controllers/examples.js`

```javascript
// ./src/api/controllers/examples.js
// import Model here
import paginate from "../helpers/paginate";

export const create = async (req, res) {
  const data = await new Promise.resolve({}); // insert
  return res.json(data);
};

export const findAll = async (req, res) {
  const { limit, offset, page } = req.query;
  let datas = new Promise.resolve({}); // query with offset and limit
  let counts = new Promise.resolve({}); // count with same query criteria
  [datas, counts] = await Promise.all([datas, counts]);
  const results = paginate(datas, counts, limit, offset, page);
  res.send(results);
}

export const findOne = async (req, res) {
  const { id } = req.params;
  const data = await new Promise.resolve({}); // find by id
  if (!data) {
    return res.status(404).json({ err: "could not find data" });
  }
  return res.json(data);
}

export const delete = async (req, res) {
  const { id } = req.params;
  const data = await  new Promise.resolve({}); // find by id and remove
  if (!data) {
    return res.status(404).json({ err: "could not find data" });
  }
  return res.json(data);
}

export const update = async (req, res) {
  const { id } = req.params;
  // { new: true } is tell mongoose return updated object into pet
  const data = await new Promise.resolve({}); // find by id and update and return update object
  if (!data) {
    return res.status(404).json({ err: "could not find data" });
  }
  return res.json(data);
};
```
