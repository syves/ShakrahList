
exports.up = function(knex, Promise) {
  return knex.schema.table('list_ingredient', function (t) {
    t.string('store').notNullable().default('No Store Selected')
  })
};

exports.down = function(knex, Promise) {
  return t.dropColumn('store').notNullable().default('No Store Selected')
};
