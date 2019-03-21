exports.up = function (knex) {
  return knex.schema.createTable('quantity', function (t) {
    t.increments('id').primary()
    t.string('unit').notNullable()
    t.timestamps(false, true)
  })
}
exports.down = function (knex) {
  return knex.schema.dropTableIfExists('quantity')
}
