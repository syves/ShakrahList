'use strict';

const Future = require ('fluture');
const knex = require ('knex') (require('../knexfile'));

const {Literal, Wild} = require ('./Component');
const JsonResponse = require ('./JsonResponse');
const Response = require ('./Response');
const db = require ('./db');
const S = require ('./sanctuary');
const pg = require ('../store');

module.exports = [

  S.Pair ([Literal ('recipes')]) ({
    GET: captures => {
      const f = Future.encaseP (captures =>
        knex.select ('id', 'name')
        .from ('recipe')
      );
      return S.map (JsonResponse.OK ({})) (f (captures));
   },
  }),

  S.Pair ([Literal ('ingredients')]) ({
    GET: captures => {
      //    f :: StrMap String -> Future Error (Array Ingredient)
      const f = Future.encaseP (captures =>
        knex.select ('id', 'name')
            .from ('ingredient')
      );
      return S.map (JsonResponse.OK ({})) (f (captures));
    },
  
   // POST: captures => //add unique ?
     // Future.of (S.maybe (knex('ingredient').insert({captures.name})
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
    DELETE: captures =>
      Future.of (S.maybe (Response.NotFound ({}) (''))
                         (ingredient => (delete db.ingredients[String (ingredient.id)],
                                         Response.NoContent ({}) ('')))
                         (S.value (captures.id) (db.ingredients))),

  }),

];
