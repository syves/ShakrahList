'use strict'

const http = require ('http');
const util = require ('util');

const S = require ('sanctuary');


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
//  GET *
//  404

//    recipesHandler :: Response -> Undefined
const recipesHandler = res => {
  res.writeHead (200, {'Content-Type': 'text/plain'});
  res.write ('recipes\n');
  res.end ();
};

const db = {
  ingredients: {
    '121': 'apples',
    '122': 'bananas',
    '123': 'cucumbers',
  },
};

//    ingredientsHandler :: Response -> Undefined
const ingredientsHandler = res => {
  res.writeHead (200, {'Content-Type': 'text/plain'});
  res.write ('ingredients\n');
  res.end ();
};

//    ingredientHandler :: Request -> Response -> Undefined
const ingredientHandler = req => res => {
  res.writeHead (200, {'Content-Type': 'text/plain'});
  res.write ('???\n');
  res.end ();
};

//    handlers :: Array (Pair (Array Component) (? -> ?))
const handlers = [
  S.Pair ([Literal ('recipes')]) (recipesHandler),
  S.Pair ([Literal ('ingredients')]) (ingredientsHandler),
  S.Pair ([Literal ('ingredients'), Wild ('id')]) (ingredientHandler),
];

const server = http.createServer ((req, res) => {
// broke find  must pass function that returns a boool?
  //    match :: Maybe (Pair (Array Component) (? -> ?))
  const match = S.find (([desc, handler]) => matches (desc) (req.url)) (handlers);

  S.map (([desc, handler]) => handler (res)) (match)
});
server.listen (8000);
