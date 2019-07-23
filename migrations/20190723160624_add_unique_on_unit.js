
exports.up = function(knex, Promise) {
 return knex.schema.alterTable('unit', function(t){
    t.unique('name')
 })
};

exports.down = function(knex, Promise) {
 return knex.schema.table('unit', function(t){
    t.string('name')
 })
};
