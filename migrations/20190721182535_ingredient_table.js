exports.up = function (knex) {
  return knex.schema.table('ingredient', function (t) {
    t.string('amount').notNullable().defaultTo(0)
  })
}
exports.down = function (knex) {
   return knex.schema.table('ingredient', function (t) {
    t.dropColumn('amount')
  })
}

