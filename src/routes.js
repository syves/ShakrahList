'use strict';

const Future = require ('fluture');
const knex = require ('knex') (require('../knexfile'));

const {Literal, Wild} = require ('./Component');
const JsonResponse = require ('./JsonResponse');
const Response = require ('./Response');
const S = require ('./sanctuary');
//const { body } = require ('./server');

module.exports = [

  //when one makes a list, one can update it many times.
  //One can add individual ingredients.
  //one can add multiple ingredients.
  //one can add ingrediants from a recipe.see recipe.js
  //Q: could reipes also have a feature so that ingredients
  //could be automatically added to an existing list?

  S.Pair ([Literal ('recipes')]) ({
    GET: captures => body => {
      const f = Future.encaseP (captures =>
        knex.select ('id', 'name')
        .from ('recipe')
      );
      return S.map (JsonResponse.OK ({})) (f (captures));
   },
    //POST: captures =>
    //const f = Future.encaseP (captures =>
      //knex('recipe').insert({body?}, ['id', 'name'])
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
    GET: captures => body => {
      //    f :: StrMap String -> Future Error (Array Ingredient)
      const f = Future.encaseP (captures =>
        knex.select ('id', 'name')
            .from ('ingredient')
      );
      return S.map (JsonResponse.OK ({})) (f (captures));
    },

    POST: captures => body => {
      console.log ('body:');
      console.log (body);
      const f = Future.encaseP (body =>
        console.log
                knex('ingredients').insert({name: body.param1}));
       // S.maybe (Future.reject('body not found'))
         //       (Future.of ((knex('ingredients').insert({name: body.param1}))))
           //     (body)
      //);
      return S.map (JsonResponse.OK ({})) (f (captures));
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


