const knex = require('knex')(require('./knexfile'))
module.exports = {
  createIngredient ({ name }) {
    console.log(`Add ingredient ${name}`)
    return knex('ingredient').insert({
      name
    })
  }
}
