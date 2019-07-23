
exports.up = function(knex, Promise) {
  return knex.schema.alterTable('ingredient', function(t) {
    t.unique('name')
  })
};

exports.down = function(knex, Promise) {
  return knex.schema.table('ingredient', function(t) {
    t.string('name')
  })
};
