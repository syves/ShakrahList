
exports.up = function(knex, Promise) {
 return knex.schema.table('recipe_ingredient', function(t) {
  t.foreign('name').references('ingredient.name')
 })
};

exports.down = function(knex, Promise) {
 return knex.schema.table('recipe_ingredient', function(t) {
  t.dropForeign('name')
 })
};
