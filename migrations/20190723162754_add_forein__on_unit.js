
exports.up = function(knex, Promise) {
  return knex.schema.table('recipe_ingredient', function (t) {
    t.foreign('unit-id').references('unit.name')
  })
};

exports.down = function(knex, Promise) {
  return knex.schema.table('recipe_ingredient', function (t) {
    t.dropForeign('unit-id')
  })
};
