exports.up = function (knex) {
  return knex.schema.table('recipe-ingredient', function (t) {
    t.renameColumn('recipe-id','recipe_id')
    t.renameColumn('ingredient-id','ingredient_id')
    t.renameColumn('quantity-id', 'quantity_id')
  })
}
exports.down = function (knex) {
  return knex.schema.table('recipe-ingredient', function (t) {
    t.renameColumn('recipe_id','recipe-id')
    t.renameColumn('ingredient_id', 'ingredient-id')
    t.renameColumn('quantity_id', 'quantity-id')
  })
}
