'use strict'

const http = require ('http');

// Incoming request:
'/recipes/123'

// Path description
/recipes/:id

// Component = Literal String | Wild String

//    Literal :: String -> Component
const Literal = s => ({
  isLiteral: true,
  isWild: false,
  value: s,
});

//    Wild :: String -> Component
const Wild = s => ({
  isLiteral: false,
  isWild: true,
  value: s,
});

//    desc :: Array Component
const desc = [Literal ('foo'), Literal ('bar')];

//    path :: String
const path = '/foo/bar';

//    all :: Foldable f => (a -> Boolean) -> f a -> Boolean
const all = pred => S.reduce (b => x => b && pred (x)) (true);

//    matches :: Array Component -> String -> Boolean
const matches = desc => path => {
  const pathStrs = S.reject (S.equals ('')) (S.splitOn ('/') (path))

  return desc.length === pathStrs.length &&
         all ((compo, pathStr) => compo.isWild || compo.value === pathStr)
             (S.zip (desc) (pathStrs));

};

matches (desc) (path);  // => true

[Literal ('recipes'), Wild ('id')] :: Array Component

// Does it match?
Yes

// What are the values of the matched path components?
{id: '123'}

const server = http.createServer ((req, res) => {
  res.writeHead (200, {'Content-Type': 'text/plain'});
  res.write ('Hello, world!\n');
  res.end ();
});
server.listen (8000);
