exports.up = function (knex) {
  return knex.schema.createTable('list', function (t) {
    t.increments('id').primary()
    t.string('name').notNullable()
    t.timestamps(false, true)
  })
}
exports.down = function (knex) {
  return knex.schema.dropTableIfExists('list')
}