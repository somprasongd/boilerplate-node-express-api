const pets = [
  {
    id: 1,
    name: 'whan',
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

class Pet {
  constructor(name, category, breed, age) {
    this.name = name;
    this.category = category;
    this.breed = breed;
    this.age = age;
  }

  create() {
    this.id = pets[pets.length - 1].id + 1;
    pets.push(this);
    return this;
  }

  update(id) {
    let pet = pets.find(u => u.id === id);
    pet = {
      ...pet,
      ...this,
    };
    return pet;
  }

  static findAll() {
    return pets;
  }

  static findById(id) {
    return pets.find(pet => pet.id === id);
  }

  static remove(id) {
    const index = pets.findIndex(pet => pet.id === id);
    return pets.splice(index, 1);
  }
}

export default Pet;
