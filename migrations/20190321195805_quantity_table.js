exports.up = function (knex) {
  return knex.schema.table('quantity', function (t) {
    t.renameColumn('name', 'unit');
  })
}
exports.down = function (knex) {
  return knex.schema.table('quantity', function (t) {
    t.renameColumn('unit', 'name');
  })
}
