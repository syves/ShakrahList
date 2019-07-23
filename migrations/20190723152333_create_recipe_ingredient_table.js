exports.up = function (knex) {
  return knex.schema.createTable('recipe_ingredient', function (t) {
    t.increments('id').primary()
    t.integer('recipe-id').references('recipe.id')
    t.integer('ingredient-id').references('ingredient.id')
    t.string('name')
    //t.foreign('name').references('ingredient.name')
    t.string('unit-id')
    //t.foreign('unit-id').references('unit.id')
    t.integer('quantity').notNullable()
    t.timestamps(false, true)
  })
}
exports.down = function (knex) {
  return knex.schema.dropTableIfExists('recipe_ingredient')
}
