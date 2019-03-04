'use strict';

const S = require ('./sanctuary');

const ingredients = exports.ingredients = {
  '121': {id: 121, name: 'apples'},
  '122': {id: 122, name: 'bananas'},
  '123': {id: 123, name: 'cucumbers'},
};

//             {name}
// const addIngredient = exports.addIngredient = ingredient =>
 //look up ingred, find largest id to crate new ingred, does name exits
//.
//. ```javascript
//. > f ('cheese') ({})
//. S.Just (S.Nothing)
//.
//. > f ('cheese') (ingredients)
//. S.Just (S.Just (123))
//.
//. > f ('apples') (ingredients)
//. S.Nothing
//. ```
const f = name =>
  S.reduce (maybeMaybeMaxId => ingred =>
              S.chain (maybeMaxId => ingred.name === name ?
                                     S.Nothing :
                                     S.Just (S.max (maybeMaxId) (S.Just (ingred.id))))
                      (maybeMaybeMaxId))
           (S.Just (S.Nothing));
