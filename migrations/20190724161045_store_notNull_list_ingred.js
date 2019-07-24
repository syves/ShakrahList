
exports.up = function(knex, Promise) {
  return knex.schema.table('list_ingredient', function(t){
    t.integer('store-id').notNullable().defalut('Store not selected')
 })
};

exports.down = function(knex, Promise) {
 return knex.schema.table('list_ingredient', function(t){
    t.integer('store-id').references('store.id')
 })
};
