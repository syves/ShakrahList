'use strict';

module.exports = {
  client: 'postgresql',
  connection: {
    database: 'postgres',
    user: 'syves',
    password: '',
  },
  pool: {
    min: 1,
    max: 1,
  },
  migrations: {
    tableName: 'knex_migrations',
  },
};
