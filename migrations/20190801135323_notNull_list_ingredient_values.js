
exports.up = function(knex) {
  return knex.schema.createTable('list_ingredient', function(t){
    t.increments('id').primary();
    t.integer('recipe-id').unsigned().notNullable();
    t.integer('ingredient-id').unsigned().notNullable();
    t.integer('unit-id').unsigned().notNullable();
    t.integer('store-id').unsigned().notNullable();
    t.integer('quantity').unsigned().notNullable();
    //t.foreign('recipe-id').references('recipe.id');
    //t.foreign('ingredient-id').references('ingredient.id');
    //t.foreign('unit-id').references('unit.id');
    //t.foreign('store-id').references('store.id');
    t.timestamps(false, true);
  })
};

exports.down = function(knex) {
  return knex.schema.dropTableIfExists('list_ingredient')
};
