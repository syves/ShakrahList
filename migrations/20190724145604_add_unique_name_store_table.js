
exports.up = function(knex, Promise) {
  return knex.schema.alterTable('store', function(t){
    t.unique('name')
 })
};

exports.down = function(knex, Promise) {
  return knex.schema.alterTable('store', function(t){
    t.String('name')
 })
};
