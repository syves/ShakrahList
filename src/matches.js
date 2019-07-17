'use strict';

const Component = require ('./Component');
const S = require ('./sanctuary');


//    matches :: Array Component -> String -> Maybe (StrMap String)
//
//    > matches ([Literal ('foos'), Wild ('id')]) ('/foos/123')
//    Just ({id: '123'})
//
//    > matches ([Literal ('foos'), Wild ('id')]) ('/foos/123/bars')
//    Nothing
module.exports = desc => path => {
  const pathStrs = S.reject (S.equals ('')) (S.splitOn ('/') (path));
  return S.reduce (acc => ([comp, pathStr]) =>
                     Component.cata (value => value === pathStr ? acc : S.Nothing)
                                    (label => S.map (S.insert (label) (pathStr)) (acc))
                                    (comp))
                  (desc.length === pathStrs.length ? S.Just ({}) : S.Nothing)
                  (S.zip (desc) (pathStrs));
};

