exports.up = function (knex) {
  return knex.schema.createTable('list-ingredient', function (t) {
    t.increments('id').primary()
    t.integer('list-id').references('list.id')
    t.integer('ingredient-id').references('ingredient.id')
    t.integer('quantity-id').references('quantity.id')
    t.integer('count').notNullable()
    t.timestamps(false, true)
  })
}
exports.down = function (knex) {
  return knex.schema.dropTableIfExists('list-ingredient')
}
