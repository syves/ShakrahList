
exports.up = function(knex, Promise) {
 return knex.schema.table('list_ingredient', function(t){
//    t.foreign('recipe-id').references('recipe.id')
 })
};

exports.down = function(knex, Promise) {
 return knex.schema.table('list_ingredient', function(t){
  //  t.dropForeign('recipe-id')
 })
};
