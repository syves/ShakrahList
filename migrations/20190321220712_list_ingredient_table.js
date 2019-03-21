exports.up = function (knex) {
  return knex.schema.createTable('list_ingredient', function (t) {
    t.increments('id').primary()
    t.integer('list_id').references('list.id')
    t.integer('ingredient_id').references('ingredient.id')
    t.integer('quantity_id').references('quantity.id')
    t.integer('count').notNullable()
    t.timestamps(false, true)
  })
}
exports.down = function (knex) {
}
