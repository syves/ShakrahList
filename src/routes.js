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
    // READ ingredients
    GET: captures => body => {
      //    f :: StrMap String -> Future Error (Array Ingredient)
      const f = Future.encaseP (captures =>
        knex.select ('id', 'name')
            .from ('ingredient')
      );
      return S.map (JsonResponse.OK ({})) (f (captures));
    },
    // CREATE ingredient
    POST: captures => bodyM => {
      //    bodyF :: Future String Body
      const bodyF =
      S.maybe (Future.reject ('Invalid request body'))
              (Future.of)
              (bodyM);

      //    insertF :: Body -> Future String Result
      const insertF = body => Future ((reject, resolve) => {
        knex('ingredient')
        .returning(['id', 'name'])
        .insert({name: body.param1})
        .then(result => { console.log ('succeeded', result); resolve (result); })
        .error(err => { console.log ('failed'); reject (err); });
      });
      return S.map (JsonResponse.OK ({})) (S.chain (insertF) (bodyF));
    }
  }),

  S.Pair ([Literal ('ingredients'), Wild ('id')]) ({
    GET: captures => body => {
      //    f :: Future Error (Array Ingredient)
      const getByIdF = captures => Future ((reject, resolve) => {
        knex('ingredient')
            .select ('id', 'name')
            .where ('id', '=', captures.id)
            .then(result => { console.log ('succeeded', result); resolve (result); })
            .error(err => { console.log ('failed'); reject (err); });
      });
      // TODO: 404s do not bubble up to client, only in server logging
       return S.chain (S.array (Future.reject (Response.NotFound ({}) ('')))
                             (head => tail => Future.of (JsonResponse.OK ({}) (head))))
                  (getByIdF (captures));
      //return S.map (JsonResponse.OK ({})) ( getByIdF (captures));
    },

    PUT: captures => bodyM => {
      const bodyF =
      S.maybe (Future.reject ('Invalid request body'))
              (Future.of)
              (bodyM);

      const updateF = body =>Future ((reject, resolve) => {
        knex('ingredient')
            .where ('id', '=', captures.id)
            .update(body, ['id', 'name'])
            .then(result => { console.log ('succeeded', result); resolve (result); })
            .error(err => { console.log ('failed'); reject (err); });
      });
      return S.map (JsonResponse.OK ({})) (S.chain (updateF) (bodyF));
    },

    DELETE: captures => body => {
      const delF = captures => Future ((reject, resolve) => {
        knex('ingredient')
            .where ('id', '=', captures.id)
            .del()
            .then(result => { console.log ('succeeded', result); resolve (result); })
            .error(err => { console.log ('failed'); reject (err); });
      });
      //TODO if delete fails returns 0
      return S.map (JsonResponse.OK ({})) (delF (captures));
      // TODO: error x.slices is not a function.
      //return S.chain (S.array (Future.reject (Response.NotFound ({}) ('')))
      //                        (head => tail => Future.of (Repsonse.NoContent ({}) ('')))
      //                        (delF (captures)));
    }
  }),
];


