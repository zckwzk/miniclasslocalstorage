import Realm from 'realm';

import {Customer, Manager} from './Schemes';

const realm = new Realm({
  path: 'myrealm',
  schema: [
    {
      name: 'Customer',
      properties: {
        id: 'int',
        name: 'string',
        email: 'string?',
        phone: 'string?',
      },
      primaryKey: 'id',
    },
  ],
});

export default realm;
