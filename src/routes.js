'use strict';

const Future = require ('fluture');
const knex = require ('knex') (require('../knexfile'));

const {Literal, Wild} = require ('./Component');
const JsonResponse = require ('./JsonResponse');
const Response = require ('./Response');
const S = require ('./sanctuary');

module.exports = [

  //when one makes a list, one can update it many times.
  //One can add individual ingredients.
  //one can add multiple ingredients.
  //one can add ingrediants from a recipe.see recipe.js
  //Q: could reipes also have a feature so that ingredients
  //could be automatically added to an existing list?

  S.Pair ([Literal ('recipes')]) ({
    GET: captures => {
      const f = Future.encaseP (captures =>
        knex.select ('id', 'name')
        .from ('recipe')
      );
      return S.map (JsonResponse.OK ({})) (f (captures));
   },
    //POST: captures =>
    //const f = Future.encaseP (captures =>
      //knex('recipe').insert({captures.name}, ['id', 'name'])
    //);
      //return S.map (JsonResponse.OK ({})) (f (captures));
  }),

  //TODO get, update, delete by ID.
  //S.Pair ([Literal ('recipes'), Wild ('id')]) ({
  // captures => queryDatabase (captures.id)
   // GET
    //UPDATE ...remove replace an ingredient, amount, or description.*
    //DELETE
  //}),

  S.Pair ([Literal ('ingredients')]) ({
    GET: captures => {
      //    f :: StrMap String -> Future Error (Array Ingredient)
      const f = Future.encaseP (captures =>
        knex.select ('id', 'name')
            .from ('ingredient')
      );
      return S.map (JsonResponse.OK ({})) (f (captures));
     },

   POST: captures => {
    const f = Future.encaseP (captures =>
      knex('ingredients').insert({name: captures.name})
    );
    //return S.chain (S.array (Future.reject (Response.InternalServerError ({}) ('')))
      //                      (head => tail => Future.of (JsonResponse.Ok ({}) (head))))
        //                    (f (captures));
      return S.map (JsonResponse.OK ({})) (f (captures));
    }
  }),

  S.Pair ([Literal ('ingredients'), Wild ('id')]) ({
    GET: captures => {
      //    f :: Future Error (Array Ingredient)
      const f = Future.encaseP (captures =>
        knex.select ('id', 'name')
            .from ('ingredient')
            .where ('id', '=', captures.id)
      );
      return S.chain (S.array (Future.reject (Response.NotFound ({}) ('')))
                              (head => tail => Future.of (JsonResponse.OK ({}) (head))))
                     (f (captures));
    },
    DELETE: captures => {
      const f = Future.encaseP (captures =>
        knex.select ('id', 'name')
            .from('ingredient')
            .where ('id', '=', captures.id)
      );
      return S.chain (S.array (Future.reject (Response.NotFound ({}) ('')))
                              (head => tail => Future.of (Repsonse.NoContent ({}) ('')))
                              (f (captures)));
    }
  }),

];


