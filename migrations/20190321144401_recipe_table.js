exports.up = function (knex) {
  return knex.schema.createTable('recipe', function (t) {
    t.increments('id').primary()
    t.string('name').notNullable()
    t.timestamps(false, true)
  })
}
exports.down = function (knex) {
  return knex.schema.dropTableIfExists('recipe')
}
