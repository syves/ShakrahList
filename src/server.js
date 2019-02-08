'use strict'

const http = require ('http');
const util = require ('util');

const S = require ('sanctuary');

const Response = require ('./Response');


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

//  GET /recipes
//  200 "recipes"
//
//  GET /ingredients
//  200 "ingredients"
//
//  GET /ingredients/123
//  200 "cucumbers"
//
//  GET /ingredients/124
//  404
//
//  GET *
//  404

const db = {
  ingredients: {
    '121': {id: 121, name: 'apples'},
    '122': {id: 122, name: 'bananas'},
    '123': {id: 123, name: 'cucumbers'},
  },
};

//    recipesHandler :: {} -> Response
const recipesHandler = captures =>
  Response.OK ({'Content-Type': 'text/plain'})
              ('recipes\n');

//    ingredientsHandler :: {} -> Response
const ingredientsHandler = captures =>
  Response.OK ({'Content-Type': 'application/json'})
              (JSON.stringify (['foo', 'bar', 'baz']));

//    ingredientHandler :: { id :: String } -> Response
const ingredientHandler = captures =>
  S.maybe (Response.NotFound ({}) (''))
          (ingredient => Response.OK ({'Content-Type': 'application/json'})
                                     (JSON.stringify (ingredient)))
          (S.get (S.K (true)) (captures.id) (db.ingredients));

const handlers = [
  S.Pair ([Literal ('recipes')]) (recipesHandler),
  S.Pair ([Literal ('ingredients')]) (ingredientsHandler),
  S.Pair ([Literal ('ingredients'), Wild ('id')]) (ingredientHandler),
];

const server = http.createServer ((req, res) => {
  //    S.reduce takes (function) (accumulator) (collection).
  //    response :: Maybe Response
  const response = S.reduce (response_ => ([desc, handler]) =>
                               S.alt (response_)
                                     // vvv :: Maybe Response
                                     (S.map (handler /* StrMap String -> Response */)
                                            // vvv :: Maybe (StrMap String)
                                            (matches (desc) (req.url))))
                            (S.Nothing /* Maybe Response */)
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
