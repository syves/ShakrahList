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
  'fantasy-land/equals': comp => comp.isLiteral && comp.value === s,
});

//    Wild :: String -> Component
exports.Wild = s => ({
  'isLiteral': false,
  'isWild': true,
  'label': s,
  '@@show': () => `Wild (${S.show (s)})`,
  [util.inspect.custom]: function() { return S.show (this); },
  'fantasy-land/equals': comp => comp.isWild && comp.label === s,
});

//    cata :: (String -> a) -> (String -> a) -> Component -> a
exports.cata = fromValue => fromLabel => comp =>
  comp.isLiteral ?
    fromValue (comp.value) :
    fromLabel (comp.label);

//  Possible use cases:
//
//  //    isLiteral :: Component -> Boolean
//  const isLiteral = Component.cata (value => true) (label => false)
//
//  //    showComponent :: Component -> String
//  const showComponent = Component.cata (value => 'Literal ("' + value + '")')
//                                       (label => 'Wild ("' + label + '")')
