let pets = [
  {
    id: 1,
    name: 'admin',
    category: 'dog',
    breed: 'ไทย',
    age: 'senior',
  },
  {
    id: 2,
    name: 'tamp',
    category: 'dog',
    breed: 'ไทย - บางแก้ว',
    age: 'adult',
  },
  {
    id: 3,
    name: 'snow',
    category: 'dog',
    breed: 'ไทย - บางแก้ว',
    age: 'adult',
  },
];

export const create = (name, category, breed, age) => {
  const pet = {
    id: pets[pets.length - 1].id + 1,
    name,
    category,
    breed,
    age,
  };
  pets.push(pet);
  return pet;
};

export const update = (id, name, category, breed, age) => {
  let pet = pets.find(u => u.id === id);
  pet = {
    ...pet,
    name,
    category,
    breed,
    age,
  };
  return pet;
};

export const findAll = () => pets;

export const findById = id => pets.find(pet => pet.id === id);

export const remove = id => {
  pets = pets.filter(pet => pet.id !== id);
  return pets;
};
