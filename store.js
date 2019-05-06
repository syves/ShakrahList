'use strict';

const knex = require ('knex') (require ('./knexfile'));

exports.createIngredient = ({name}) => {
  console.log (`Add ingredient ${name}`);
  return knex ('ingredient')
         .insert ({name});
};
