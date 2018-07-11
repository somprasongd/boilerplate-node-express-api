# Example with mongoose

Use mongoose to connect MongoDB

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
------------models # ORM files
------------routes # api routes, use file name to api URI (/api/[filename])
------------index.js # export all router (express.Router())
--------/config # config variables
------------development.js # config in dev mode
------------index.js # export this module with match environtment
------------production.js # config in prod mode
--------/doc # api document
------------swagger.json # swagger config file
--------/startup # startup app module
------------config.js # validate config variables, if not have exit app
------------db.js # connect to database
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
------------models # ORM files
------------resources # api routes, use directory name to api URI (/api/[dirname])
----------------routes1 # /api/routes1
--------------------index.js # export router in routes1.router.js
--------------------routes1.controllers.js # handler functions for each route to handle req, res
--------------------routes1.router.js # handler router for /api/routes1
----------------routes2 # /api/routes2
--------------------index.js # export router in routes2.router.js
--------------------routes2.controllers.js # handler functions for each route to handle req, res
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
  DB_URI: "mongodb://localhost/demo"
};
```

- In production mode set environtment to `appName_DB_URI`

### Step 2: Connect to MongoDB

- Install mongoose: `npm i -S mongoose`

- Open file `./src/startup/db.js` and write code like this:

```javascript
// ./src/startup/db.js
import mongoose from "mongoose";
import winston from "winston";
import config from "../config";

export default () => {
  mongoose
    .connect(
      config.DB_URI,
      { useNewUrlParser: true }
    )
    .then(() => winston.info("Connected to MongoDB..."));
};
```

### Step 3: Create Model

- Create new model in `./src/api/models`, Example pet.js to create Pet model with validators.

```javascript
// ./src/api/models/pet.js
import Joi from "joi";
import mongoose from "mongoose";
import { categorySchema } from "./category";

const petSchema = new mongoose.Schema({
  name: {
    type: String,
    required: [true, "Pet must have name"],
    minlength: 2,
    maxlength: 50
    // match: /pattern/
  },
  category: {
    type: categorySchema,
    required: true
  },
  breed: {
    type: String,
    required: [true, "Pet must have breed"]
  },
  age: {
    type: String,
    required: [
      true,
      'Pet must have age in ["baby", "young", "adult", "senior"]'
    ],
    enum: ["baby", "young", "adult", "senior"],
    lowercase: true,
    // uppercase: true,
    trim: true
  },
  created_on: {
    type: Date,
    default: Date.now()
  },
  ownerId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "User",
    required: true
  }
});

const Pet = mongoose.model("Pet", petSchema);

function validatePet(pet) {
  const schema = Joi.object().keys({
    name: Joi.string()
      .min(2)
      .max(50)
      .required(),
    categoryId: Joi.objectId().required(),
    breed: Joi.string().required(),
    age: Joi.string().required(),
    ownerId: Joi.objectId().required()
  });
  return Joi.validate(pet, schema);
}

export { Pet, validatePet as validate };
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
import Fawn from "fawn";
import { Owner } from "../models/owner";
import { Pet, validate } from "../models/pet";
import { Category } from "../models/category";
import paginate from "../helpers/paginate.js";

export const create = async (req, res) => {
  const { error } = validate(req.body);

  if (error)
    return res
      .status(400)
      .json({ error: { message: error.details[0].message } });

  const category = await Category.findById(req.body.categoryId);
  if (!category)
    return res.status(400).json({ error: { message: "Invalid category." } });

  let pet = new Pet({
    name: req.body.name,
    category: {
      _id: category._id,
      name: category.name
    },
    breed: req.body.breed,
    age: req.body.age,
    ownerId: req.body.ownerId
  });
  pet = await pet.save();

  return res.json(pet);
};

export const findAll = async (req, res) => {
  const { limit, offset, page } = req.query;
  let pets = await Pet.find()
    .sort("name")
    .skip(offset)
    .limit(limit);
  let counts = Pet.count({}).exec();
  [pets, counts] = await Promise.all([pets, counts]);
  const results = paginate(pets, counts, limit, offset, page);
  res.send(results);
};

export const findOne = async (req, res) => {
  const pet = await Pet.findById(req.params.id);

  if (!pet)
    return res
      .status(404)
      .json({ error: { message: "The pet with the given ID was not found." } });

  res.send(pet);
};

export const remove = async (req, res) => {
  const pet = await Pet.findByIdAndRemove(req.params.id);

  if (!pet)
    return res
      .status(404)
      .json({ error: { message: "The pet with the given ID was not found." } });

  res.send(pet);
};

export const update = async (req, res) => {
  const { error } = validate(req.body);
  if (error)
    return res.status(400).json({
      error: { message: error.details.map(detail => detail.message) }
    });

  const category = await Category.findById(req.body.categoryId);
  if (!category)
    return res.status(400).json({ error: { message: "Invalid category." } });

  const pet = await Pet.findByIdAndUpdate(
    req.params.id,
    {
      name: req.body.name,
      category: {
        _id: category._id,
        name: category.name
      },
      breed: req.body.breed,
      age: req.body.age,
      ownerId: req.user._id
    },
    { new: true }
  );

  if (!pet)
    return res
      .status(404)
      .json({ error: { message: "The pet with the given ID was not found." } });

  res.send(pet);
};
```

### Transactions in MongoDB

- Install [Fawn](https://www.npmjs.com/package/fawn): `npm i -S fawn`

- Example use fawn to insert new pet and update total pets in owner.

- Fawn init in `./src/startup/db.js`

```javascript
import Fawn from "fawn";
import mongoose from "mongoose";
import winston from "winston";
import config from "../config";

export default () => {
  mongoose
    .connect(
      config.DB_URI,
      { useNewUrlParser: true }
    )
    .then(() => winston.info("Connected to MongoDB..."));

  // add Fawn init here
  Fawn.init(mongoose);
};
```

- Edit create pet function:

```javascript
// ./src/startup/db.js
import Fawn from "fawn";
import Pet from "../models/pet";
import Owner from "../models/owner";

// ...

export const create = async (req, res) => {
  // ...

  // replace this line:
  // pet = await pet.save();

  const task = Fawn.Task();
  task.save(Pet, pet);
  task.update(Owner, { _id: pet.ownerId }, { $inc: { petCount: 1 } });
  task.run({ useMongoose: true });
  return res.json(pet);
};
```

### Pagination plugin

- Install `npm i -S mongoose-paginate`

- Edit `./src/api/models/pet.js`

```javascript
// ./src/api/models/pet.js
import mongoosePaginate from "mongoose-paginate";

// ...

// set plugin before export
petSchema.plugin(mongoosePaginate);
export default mongoose.model("Pet", petSchema);
```

- Edit `findAll` function in `./src/api/controllers/pets.js`

```javascript
// ./src/api/controllers/pets.js
import Pet from "../models/pet";

export const findAll = async (req, res) {
  const { page, limit } = req.query;
    const options = {
      page: parseInt(page, 10) || 1,
      limit: parseInt(limit, 10) || 10,
    };
    const pets = await Pet.paginate({}, options);
    return res.json(pets);
}
```
