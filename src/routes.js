'use strict';

const Future = require ('fluture');
const knex = require ('knex') (require('../knexfile.js'));

const {Literal, Wild} = require ('./Component');
const JsonResponse = require ('./JsonResponse');
const Response = require ('./Response');
const S = require ('./sanctuary');


module.exports = [
  //get stores

  /* you can make a list by:
   * 1. dragging items(how are items dispalys/grouped) to a list
   * 2. draggig recipes to list -> GET recipe_ingredients/ filter id=recipe_id
   * 3. unselect from your recent list/starter list [not MVP]
   *
   * choose stores
   * view 2: choose locations -> change the view to sorting by store
   *
   * */
  //GET lists
   S.Pair ([Literal ('stores')]) ({
    GET: captures => body => {
      const f = Future.encaseP (captures =>
        knex.select ('id', 'name')
        .from ('store')
      );
      return S.map (JsonResponse.OK ({})) (f (captures));
    },

     POST: captures => bodyM => {
      const bodyF =
      S.maybe (Future.reject ('Invalid request body'))
              (Future.of)
              (bodyM);

      const insertF = body => Future ((reject, resolve) => {
        knex('store')
        .returning(['id', 'name'])
        .insert(body)
        .then(result => { console.log ('succeeded', result); resolve (result); })
        .error(err => { console.log ('failed'); reject (err); });
      });
      return S.map (JsonResponse.OK ({})) (S.chain (insertF) (bodyF));
    }

  }),
  S.Pair ([Literal ('stores'), Wild ('id')]) ({
    GET: captures => body => {
      const getByIdF = captures => Future ((reject, resolve) => {
        knex('store')
            .select ('id', 'name')
            .where ('id', '=', captures.id)
            .then(result => { console.log ('succeeded', result); resolve (result); })
            .error(err => { console.log ('failed'); reject (err); });
      });
       return S.chain (S.array (Future.reject (Response.NotFound ({}) ('')))
                             (head => tail => Future.of (JsonResponse.OK ({}) (head))))
                  (getByIdF (captures));
    },

    PUT: captures => bodyM => {
      const bodyF =
      S.maybe (Future.reject ('Invalid request body'))
              (Future.of)
              (bodyM);

      const updateF = body =>Future ((reject, resolve) => {
        knex('store')
            .where ('id', '=', captures.id)
            .update(body, ['id', 'name'])
            .then(result => { console.log ('succeeded', result); resolve (result); })
            .error(err => { console.log ('failed'); reject (err); });
      });
      return S.map (JsonResponse.OK ({})) (S.chain (updateF) (bodyF));
    },

    DELETE: captures => body => {
      const delF = captures => Future ((reject, resolve) => {
        knex('store')
            .where ('id', '=', captures.id)
            .del()
            .then(result => { console.log ('succeeded', result); resolve (result); })
            .error(err => { console.log ('failed'); reject (err); });
      });
      return S.map (JsonResponse.OK ({})) (delF (captures));
    }
  }),

  S.Pair ([Literal ('recipes')]) ({
    GET: captures => body => {
      const f = Future.encaseP (captures =>
        knex.select ('id', 'name')
        .from ('recipe')
      );
      return S.map (JsonResponse.OK ({})) (f (captures));
    },

     POST: captures => bodyM => {
      const bodyF =
      S.maybe (Future.reject ('Invalid request body'))
              (Future.of)
              (bodyM);

      const insertF = body => Future ((reject, resolve) => {
        knex('recipe')
        .returning(['id', 'name', 'description'])
        .insert(body)
        .then(result => { console.log ('succeeded', result); resolve (result); })
        .error(err => { console.log ('failed'); reject (err); });
      });
      return S.map (JsonResponse.OK ({})) (S.chain (insertF) (bodyF));
    }

  }),
  S.Pair ([Literal ('recipes'), Wild ('id')]) ({
    GET: captures => body => {
      const getByIdF = captures => Future ((reject, resolve) => {
        knex('recipe')
            .select ('id', 'name', 'description')
            .where ('id', '=', captures.id)
            .then(result => { console.log ('succeeded', result); resolve (result); })
            .error(err => { console.log ('failed'); reject (err); });
      });
       return S.chain (S.array (Future.reject (Response.NotFound ({}) ('')))
                             (head => tail => Future.of (JsonResponse.OK ({}) (head))))
                  (getByIdF (captures));
    },

    PUT: captures => bodyM => {
      const bodyF =
      S.maybe (Future.reject ('Invalid request body'))
              (Future.of)
              (bodyM);

      const updateF = body =>Future ((reject, resolve) => {
        knex('recipe')
            .where ('id', '=', captures.id)
            .update(body, ['id', 'name', 'description'])
            .then(result => { console.log ('succeeded', result); resolve (result); })
            .error(err => { console.log ('failed'); reject (err); });
      });
      return S.map (JsonResponse.OK ({})) (S.chain (updateF) (bodyF));
    },

    DELETE: captures => body => {
      const delF = captures => Future ((reject, resolve) => {
        knex('recipe')
            .where ('id', '=', captures.id)
            .del()
            .then(result => { console.log ('succeeded', result); resolve (result); })
            .error(err => { console.log ('failed'); reject (err); });
      });
      return S.map (JsonResponse.OK ({})) (delF (captures));
    }
  }),

  S.Pair ([Literal ('recipe-ingredients')]) ({
    GET: captures => body => {
      const f = Future.encaseP (captures =>
        knex.select (['id', 'recipe-id', 'ingredient-id', 'quantity', 'unit-id'])
        .from ('recipe_ingredient')
      );
      return S.map (JsonResponse.OK ({})) (f (captures));
    },

     POST: captures => bodyM => {
      const bodyF =
      S.maybe (Future.reject ('Invalid request body'))
              (Future.of)
              (bodyM);

      //    insertF :: Body -> Future String Result
      const insertF = body => Future ((reject, resolve) => {
        knex('recipe_ingredient')
        .returning(['id', 'recipe-id', 'ingredient-id', 'quantity', 'unit-id'])
        .insert(body)
        .then(result => { console.log ('succeeded', result); resolve (result); })
        .error(err => { console.log ('failed'); reject (err); });
      });
      return S.map (JsonResponse.OK ({})) (S.chain (insertF) (bodyF));
    }
  }),
  S.Pair ([Literal ('recipe-ingredients'), Wild ('id')]) ({
    GET: captures => body => {
      const getByIdF = captures => Future ((reject, resolve) => {
        knex('recipe_ingredient')
            .select ('id', 'ingredient-id', 'quantity', 'unit-id')
            .where ('id', '=', captures.id)
            .then(result => { console.log ('succeeded', result); resolve (result); })
            .error(err => { console.log ('failed'); reject (err); });
      });
       return S.chain (S.array (Future.reject (Response.NotFound ({}) ('')))
                             (head => tail => Future.of (JsonResponse.OK ({}) (head))))
                  (getByIdF (captures));
    },

    PUT: captures => bodyM => {
      const bodyF =
      S.maybe (Future.reject ('Invalid request body'))
              (Future.of)
              (bodyM);

      const updateF = body =>Future ((reject, resolve) => {
        knex('recipe_ingredient')
            .where ('id', '=', captures.id)
            .update(body, ['id', 'ingredient-id', 'quantity', 'unit-id'])
            .then(result => { console.log ('succeeded', result); resolve (result); })
            .error(err => { console.log ('failed'); reject (err); });
      });
      return S.map (JsonResponse.OK ({})) (S.chain (updateF) (bodyF));
    },

    DELETE: captures => body => {
      const delF = captures => Future ((reject, resolve) => {
        knex('recipe_ingredient')
            .where ('id', '=', captures.id)
            .del()
            .then(result => { console.log ('succeeded', result); resolve (result); })
            .error(err => { console.log ('failed'); reject (err); });
      });
      return S.map (JsonResponse.OK ({})) (delF (captures));
    }
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

    POST: captures => bodyM => {
      const bodyF =
      S.maybe (Future.reject ('Invalid request body'))
              (Future.of)
              (bodyM);

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


