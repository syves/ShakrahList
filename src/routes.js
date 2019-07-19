'use strict';

const Future = require ('fluture');
const knex = require ('knex') (require('../knexfile.js'));

const {Literal, Wild} = require ('./Component');
const JsonResponse = require ('./JsonResponse');
const Response = require ('./Response');
const S = require ('./sanctuary');


module.exports = [

  S.Pair ([Literal ('recipes')]) ({
    GET: captures => body => {
      const f = Future.encaseP (captures =>
        knex.select ('id', 'name')
        .from ('recipe')
      );
      return S.map (JsonResponse.OK ({})) (f (captures));
   },
  }),

  S.Pair ([Literal ('ingredients')]) ({
    GET: captures => body => {
      //    f :: StrMap String -> Future Error (Array Ingredient)
      const f = Future.encaseP (captures =>
        knex.select ('id', 'name')
            .from ('ingredient')
      );
      return S.map (JsonResponse.OK ({})) (f (captures));
    },
/*
    POST: captures => bodyM =>
      S.map (JsonResponse.OK ({}))
            (S.chain (Future.encaseP (body => knex('ingredients').insert({name: body.param1})))
                     (S.maybe (Future.reject ('Invalid request body'))
                              (Future.of)
                              (bodyM))),
  }),
  */
    POST: captures => bodyM => {
      //    bodyF :: Future String Body
      const bodyF =
      S.maybe (Future.reject ('Invalid request body'))
              (Future.of)
              (bodyM);

      //    insertF :: Body -> Future String Result
      const insertF = body => Future ((reject, resolve) => {
        knex('ingredient')
        .insert({name: body.param1})
        .then(result => { console.log ('succeeded'); resolve (result); })
        .error(err => { console.log ('failed'); reject (err); });
      });

      return S.map (JsonResponse.OK ({})) (S.chain (insertF) (bodyF));
    }
  }),

  S.Pair ([Literal ('ingredients'), Wild ('id')]) ({
    GET: captures => body => {
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
    DELETE: captures => body => {
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


