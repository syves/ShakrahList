'use strict';

const {Literal, Wild} = require ('./Component');
const JsonResponse = require ('./JsonResponse');
const Response = require ('./Response');
const db = require ('./db');
const S = require ('./sanctuary');


module.exports = [

  S.Pair ([Literal ('recipes')]) ({
    GET: captures =>
      JsonResponse.OK ({}) ('recipes'),
  }),

  S.Pair ([Literal ('ingredients')]) ({
    GET: captures =>
      JsonResponse.OK ({}) (Object.values (db.ingredients)),
    POST: captures =>
      null,
  }),

  S.Pair ([Literal ('ingredients'), Wild ('id')]) ({
    GET: captures =>
      S.maybe (Response.NotFound ({}) (''))
              (JsonResponse.OK ({}))
              (S.get (S.K (true)) (captures.id) (db.ingredients)),
    DELETE: captures =>
      null,
  }),

];
