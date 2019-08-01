
exports.up = function(knex, Promise) {
 knex.schema.alterTable('list_ingredient', function(t){
   t.foreign('recipe-id').references('recipe.id');
   t.foreign('ingredient-id').references('ingredient.id');
   t.foreign('unit-id').references('unit.id');
   t.foreign('store-id').references('store.id');
 })
};

exports.down = function(knex, Promise) {
 knex.schema.table('list_ingredient', function(t){
   t.dropForeign('recipe-id').references('recipe.id');
   t.dropForeign('ingredient-id').references('ingredient.id');
   t.dropForeign('unit-id').references('unit.id');
   t.dropForeign('store-id').references('store.id');
 })
};
