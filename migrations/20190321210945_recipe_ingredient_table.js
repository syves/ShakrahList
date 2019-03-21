exports.up = function (knex) {
  return knex.schema.renameTable('recipe-ingredient', 'recipe_ingredient')
}
exports.down = function (knex) {
}
