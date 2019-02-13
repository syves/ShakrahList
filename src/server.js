'use strict'

const http = require ('http');
const util = require ('util');

const S = require ('sanctuary');

const Response = require ('./Response');
const JsonResponse = require ('./JsonResponse');


//    Literal :: String -> Component
const Literal = s => ({
  'isLiteral': true,
  'isWild': false,
  'value': s,
  '@@show': () => `Literal (${S.show (s)})`,
  [util.inspect.custom]: function() { return S.show (this); },
});

//    Wild :: String -> Component
const Wild = s => ({
  'isLiteral': false,
  'isWild': true,
  'label': s,
  '@@show': () => `Wild (${S.show (s)})`,
  [util.inspect.custom]: function() { return S.show (this); },
});

//    all :: Foldable f => (a -> Boolean) -> f a -> Boolean
const all = pred => S.reduce (b => x => b && pred (x)) (true);

//    matches :: Array Component -> String -> Maybe (StrMap String)
//
//    > matches ([Literal ('foos'), Wild ('id')]) ('/foos/123')
//    Just ({id: '123'})
//
//    > matches ([Literal ('foos'), Wild ('id')]) ('/foos/123/bars')
//    Nothing
const matches = desc => path => {
  const pathStrs = S.reject (S.equals ('')) (S.splitOn ('/') (path));

  return S.reduce (acc /* :: Maybe (StrMap String) */ =>
                    ([comp /* :: Component */, pathStr /* :: String */]) =>
                      comp.isWild ?
                        S.map (S.insert (comp.label) (pathStr)) (acc) :
                      // Literal
                        comp.value === pathStr ? acc : S.Nothing)
                  (desc.length === pathStrs.length ? S.Just ({}) : S.Nothing)
                  (S.zip (desc) (pathStrs));
};

const db = {
  ingredients: {
    '121': {id: 121, name: 'apples'},
    '122': {id: 122, name: 'bananas'},
    '123': {id: 123, name: 'cucumbers'},
  },
};

//    GET_recipes :: {} -> Response
const GET_recipes = captures =>
  JsonResponse.OK ({}) ('recipes');

//    GET_ingredients :: {} -> Response
const GET_ingredients = captures =>
  JsonResponse.OK ({}) (Object.values (db.ingredients));

const POST_ingredients = captures => null;

const DELETE_ingredients_$id = captures => null;

//    GET_ingredients_$id :: { id :: String } -> Response
const GET_ingredients_$id = captures =>
  S.maybe (Response.NotFound ({}) (''))
          (JsonResponse.OK ({}))
          (S.get (S.K (true)) (captures.id) (db.ingredients));

const handlers = [
  S.Pair ([Literal ('recipes')])
         ({GET: GET_recipes}),
  S.Pair ([Literal ('ingredients')])
         ({GET: GET_ingredients,
           POST: POST_ingredients}),
  S.Pair ([Literal ('ingredients'), Wild ('id')])
         ({GET: GET_ingredients_$id,
           DELETE: DELETE_ingredients_$id}),
];

const server = http.createServer ((req, res) => {
  //    S.reduce takes (function) (accumulator) (collection).
  //    response :: Maybe Response
  const response = S.reduce (response_ => ([desc, handlers]) =>
                               S.alt (response_)

                                     req.method :: String
                                     handlers :: StrMap Function

                                     S.maybe (Response.MethodNotAllowed ({Allow: S.joinWith (', ') (Object.keys (handlers))}) (''))
                                             (handler => response)
                                             (S.get (S.K (true)) (req.method) (handlers))

                                     (S.map (handlers.GET)
                                            (matches (desc)
                                                     (req.url))))
                            (S.Nothing)
                            (handlers);

  if (response.isJust) {
    res.writeHead (response.value.statusCode, response.value.headers);
    res.write (response.value.body);
    res.end ();
  } else {
    // Custom error handling...
  }
});
server.listen (8000);
