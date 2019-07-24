
exports.up = function(knex, Promise) {
  return knex.schema.table('list', function(t){
    t.dropColumn('name');
  })
};

exports.down = function(knex, Promise) {
  return knex.schema.table('list', function(t){
    t.String('name');
  })
};
