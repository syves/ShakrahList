exports.up = function (knex) {
  return knex.schema.createTable('list_ingredient', function (t) {
    t.increments('id').primary()
    // can name be derived later from ingredient.id?
    //t.foreign('name').references('Ingredient.name')
    t.integer('recipe-id').references('recipe.id')
    t.integer('ingredient-id').references('ingredient.id')
    t.integer('unit-id').references('unit.id')
    t.integer('quantity').notNullable()
    t.timestamps(false, true)
  })
}
exports.down = function (knex) {
  return knex.schema.dropTableIfExists('list_ingredient')
}
