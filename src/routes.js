'use strict';

const Future = require ('fluture');

const {Literal, Wild} = require ('./Component');
const JsonResponse = require ('./JsonResponse');
const Response = require ('./Response');
const db = require ('./db');
const S = require ('./sanctuary');


module.exports = [

  S.Pair ([Literal ('recipes')]) ({
    GET: captures =>
      Future.after (2500, JsonResponse.OK ({}) ('recipes')),
  }),

  S.Pair ([Literal ('ingredients')]) ({
    GET: captures =>
      Future.of (JsonResponse.OK ({}) (Object.values (db.ingredients))),
    POST: captures => //if name is unique create ingred.
      ,
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
