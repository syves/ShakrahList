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
    GET: captures =>
      Future.after (2500, JsonResponse.OK ({}) ('recipes')),
  }),

  S.Pair ([Literal ('ingredients')]) ({
    GET: captures => {
      //    fut :: Future Error (Array Ingredient)
      const fut = Future ((reject, resolve) => {
        knex.select ('id', 'name')
            .from ('ingredient')
            .then (resolve, reject);
      });
      return S.map (JsonResponse.OK ({})) (fut);
    },
   // POST: captures => //add unique ?
     // Future.of (S.maybe (knex('ingredient').insert({captures.name})
  }),

  S.Pair ([Literal ('ingredients'), Wild ('id')]) ({
    GET: captures =>
      Future.of (S.maybe (Response.NotFound ({}) (''))
                         (JsonResponse.OK ({}))
                         (S.value (captures.id) (db.ingredients))),
    DELETE: captures =>
      Future.of (S.maybe (Response.NotFound ({}) (''))
                         (ingredient => (delete db.ingredients[String (ingredient.id)],
                                         Response.NoContent ({}) ('')))
                         (S.value (captures.id) (db.ingredients))),

  }),

];
