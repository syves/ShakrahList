'use strict';

const util = require ('util');

const S = require ('./sanctuary');

//    Literal :: String -> Component
exports.Literal = s => ({
  'isLiteral': true,
  'isWild': false,
  'value': s,
  '@@show': () => `Literal (${S.show (s)})`,
  [util.inspect.custom]: function() { return S.show (this); },
});

//    Wild :: String -> Component
exports.Wild = s => ({
  'isLiteral': false,
  'isWild': true,
  'label': s,
  '@@show': () => `Wild (${S.show (s)})`,
  [util.inspect.custom]: function() { return S.show (this); },
});
