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
    GET: captures =>
      //Future.of (JsonResponse.OK ({}) (Object.values (db.ingredients))),

      Future.of (JsonResponse.OK ({})

                (knex.select('id', 'name')
                   .from('ingredient')
                   .on('query-response', function(response, obj, builder) {
                     return console.log('get ingredients');
                   })
                   .then(function(response) {
                     return console.log(response);
                   }).catch(function(error) {
                     return console.log(error);
                   }))
                ),
   // POST: captures => //add unique ?
     // Future.of (S.maybe (knex('ingredient').insert({captures.name})
  }),

  S.Pair ([Literal ('ingredients'), Wild ('id')]) ({
    GET: captures =>
      Future.of (S.maybe (Response.NotFound ({}) (''))
                         (JsonResponse.OK ({}))
                         (S.get (S.K (true)) (captures.id) (db.ingredients))),
    DELETE: captures =>
      Future.of (S.maybe (Response.NotFound ({}) (''))
                         (ingredient => (delete db.ingredients[String (ingredient.id)],
                                         Response.NoContent ({}) ('')))
                         (S.get (S.K (true)) (captures.id) (db.ingredients))),

  }),

];
