const Costumer = {
  name: 'Customer',
  properties: {
    id: 'int',
    name: 'string',
    email: 'string?',
    phone: 'string?',
  },
  primaryKey: 'id',
};

const Manager = {
  name: 'Manager',
  properties: {
    id: 'int',
    name: 'string',
    email: 'string?',
    phone: 'string?',
  },
  primaryKey: 'id',
};

export const {Costumer, Manager};
