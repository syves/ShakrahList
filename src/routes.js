'use strict';

const Future = require ('fluture');
const knex = require ('knex') (require('../knexfile.js'));

const {Literal, Wild} = require ('./Component');
const JsonResponse = require ('./JsonResponse');
const Response = require ('./Response');
const S = require ('./sanctuary');


module.exports = [
   S.Pair ([Literal ('lists')]) ({
    GET: captures => body => {
      const f = Future.encaseP (captures =>
        knex.select ('id', 'updated_at')
        .from ('list')
      );
      return S.map (JsonResponse.OK ({})) (f (captures));
    },

     POST: captures => bodyM => {
      const bodyF =
      S.maybe (Future.reject ('Invalid request body'))
              (Future.of)
              (bodyM);

      const insertF = body => Future ((reject, resolve) => {
        knex('list')
        .returning(['id', 'created_at'])
        .insert(body)
        .then(result => { console.log ('succeeded', result); resolve (result); })
        .error(err => { console.log ('failed'); reject (err); });
      });
      return S.map (JsonResponse.OK ({})) (S.chain (insertF) (bodyF));
      return S.chain (S.array (Response.NotFound ({}) (''))
                              (JsonResponse.Ok ({}) (err)))
                   (insertF (bodyF));
    }

  }),
  S.Pair ([Literal ('lists'), Wild ('id')]) ({
    GET: captures => body => {
      const getByIdF = captures => Future ((reject, resolve) => {
        knex('list')
            .select ('id', 'updated_at')
            .where ('id', '=', captures.id)
            .then(result => { resolve (result); })
            .error(err => { reject (err); });
      });
       return S.chain (S.array (Future.of (Response.NotFound ({}) ('')))
                               (head => tail => Future.of (JsonResponse.OK ({}) (head))))
                      (getByIdF (captures));
    }
  }),

    // PUT is not supported here, lists do not currently have a name.
    // PUT is supported on list_ingredients only.

    //DELETE should only be supported internally. Lists will be used for user behaviour data.

    S.Pair ([Literal ('list-ingredients')]) ({
    GET: captures => body => {
      const f = Future.encaseP (captures =>
        knex.select ('id', 'recipe-id', 'ingredient-id', 'quantity', 'unit-id', 'store-id')
        .from ('list_ingredient')
      );
      return S.map (JsonResponse.OK ({})) (f (captures));
    },

     POST: captures => bodyM => {
       //    bodyF :: Future String Object
       const bodyF =
       S.maybe (Future.reject ('Invalid request body'))
               (Future.of)
               (bodyM);

       //    insertF :: Object -> Future String Result
       const insertF = body => Future ((reject, resolve) => {
         knex('list_ingredient')
         .returning(['id', 'recipe-id', 'ingredient-id', 'quantity', 'unit-id', 'store-id'])
         .insert(body)
         .then(result => { resolve (result); })
         .error(err => { reject (err.message); });
       });

//     Future.chainRej :: (String -> Future String Result) -> Future String Result -> Future String Result

       return Future.chainRej (s => (console.log (s) || s === 'XXX') ?
                                    Future.of ('TK') :
                                    Future.rej (s))
                              (S.chain (insertF) (bodyF));

       //should fail is body is not unique
       //return S.map (JsonResponse.OK ({})) (S.chain (updateF) (bodyF));

       //return S.chain (S.array (Future.of (Response.NotFound ({}) ('')))
       //                        (head => tail => Future.of (JsonResponse.OK ({}))))
       //               (S.chain (insertF) (bodyF)))
    }

  }),
  S.Pair ([Literal ('list-ingredients'), Wild ('id')]) ({
    /*
     *When a recipe is dragged to a list, all recipe_ingredients
     will be inserted into list_ingredients.
     * */
    GET: captures => body => {
      const getByIdF = captures => Future ((reject, resolve) => {
        knex('list_ingredient')
            .select ('id', 'recipe-id', 'ingredient-id', 'quantity', 'unit-id', 'store-id')
            .where ('id', '=', captures.id)
            .then(result => { resolve (result); })
            .error(err => { reject (err); });
      });
       return S.chain (S.array (Future.of (Response.NotFound ({}) ('')))
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
            .update(body, ['id', 'recipe-id', 'ingredient-id', 'quantity', 'unit-id', 'store-id'])
            .then(result => { resolve (result); })
            .error(err => { reject (err); });
      });
      return S.map (JsonResponse.OK ({})) (S.chain (updateF) (bodyF));
    },

    DELETE: captures => body => {
      const delF = captures => Future ((reject, resolve) => {
        knex('list_ingredient')
            .where ('id', '=', captures.id)
            .del()
            .then(result => { resolve (result); })
            .error(err => { reject (err); });
      });
      return S.map (rows => rows == 0 ?
                              Response.NotFound ({}) ('') :
                              Response.NoContent ({}) (''))
                   (delF (captures));
    }
  }),


  S.Pair ([Literal ('stores')]) ({
    GET: captures => body => {
      const f = Future.encaseP (captures =>
        knex.select ('id', 'name')
        .from ('store')
      );
      return S.map (JsonResponse.OK ({})) (f (captures));
    },
    //TODO error on post non uique store does not bubble up -> cannot resolve POST?
    //SERVER: Unhandled rejection error: duplicate key value violates unique constraint "store_name_unique"
     POST: captures => bodyM => {
      const bodyF =
      S.maybe (Future.reject ('Invalid request body'))
              (Future.of)
              (bodyM);

      const insertF = body => Future ((reject, resolve) => {
        knex('store')
        .returning(['id', 'name'])
        .insert(body)
        .then(result => { resolve (result); })
        .error(err => { reject (err); });
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
            .then(result => { resolve (result); })
            .error(err => { reject (err); });
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
            .then(result => { resolve (result); })
            .error(err => { reject (err); });
      });
      return S.map (JsonResponse.OK ({})) (S.chain (updateF) (bodyF));
    },

    DELETE: captures => body => {
      const delF = captures => Future ((reject, resolve) => {
        knex('store')
            .where ('id', '=', captures.id)
            .del()
            .then(result => { resolve (result); })
            .error(err => { reject (err); });
      });
      return S.map (rows => rows == 0 ?
                              Response.NotFound ({}) ('') :
                              Response.NoContent ({}) (''))
                   (delF (captures));
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
        .then(result => { resolve (result); })
        .error(err => { reject (err); });
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
            .then(result => { resolve (result); })
            .error(err => { reject (err); });
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
            .then(result => { resolve (result); })
            .error(err => { reject (err); });
      });
      return S.map (JsonResponse.OK ({})) (S.chain (updateF) (bodyF));
    },

    DELETE: captures => body => {
      const delF = captures => Future ((reject, resolve) => {
        knex('recipe')
            .where ('id', '=', captures.id)
            .del()
            .then(result => { resolve (result); })
            .error(err => { reject (err); });
      });
      return S.map (rows => rows == 0 ?
                              Response.NotFound ({}) ('') :
                              Response.NoContent ({}) (''))
                   (delF (captures));
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
        .then(result => { resolve (result); })
        .error(err => { reject (err); });
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
            .then(result => { resolve (result); })
            .error(err => { reject (err); });
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
            .then(result => { resolve (result); })
            .error(err => { reject (err); });
      });
      return S.map (JsonResponse.OK ({})) (S.chain (updateF) (bodyF));
    },

    DELETE: captures => body => {
      const delF = captures => Future ((reject, resolve) => {
        knex('recipe_ingredient')
            .where ('id', '=', captures.id)
            .del()
            .then(result => { resolve (result); })
            .error(err => { reject (err); });
      });
      return S.map (rows => rows == 0 ?
                              Response.NotFound ({}) ('') :
                              Response.NoContent ({}) (''))
                   (delF (captures));
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

      //    insertF :: Object -> Future String Response
      const insertF = body => Future ((reject, resolve) => {
        knex('ingredient')
        .returning(['id', 'name'])
        .insert(body)
        .then(
          result => { resolve (JsonReponse.OK ({}) (result)); },
          err => { resolve (Response.BadRequest ({}) (err.detail)); }
        );
      });
      return S.chain (insertF) (bodyF);
    }
  }),

  S.Pair ([Literal ('ingredients'), Wild ('id')]) ({
    GET: captures => body => {
      //    getByIdF :: StrMap String -> Future Error (Array Ingredient)
      const getByIdF = captures => Future ((reject, resolve) => {
        knex('ingredient')
            .select ('id', 'name')
            .where ('id', '=', captures.id)
            .then(
              result => { resolve (JsonResponse.OK ({}) (result)); },
              err => { resolve (Response.NotFound ({}) (err.detail)); }
        );
      });
      return getByIdF (captures);
      //      return S.chain (S.array (Future.of (Response.NotFound ({}) ('')))
           //                  (head => tail => Future.of (JsonResponse.OK ({}) (head))))
             //         (getByIdF (captures));
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
      return S.map (rows => rows == 0 ?
                              Response.NotFound ({}) ('') :
                              Response.NoContent ({}) (''))
                   (delF (captures));
    }
  }),
];


