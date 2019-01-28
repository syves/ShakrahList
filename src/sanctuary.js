'use strict';

const S = require ('sanctuary');
const $ = require ('sanctuary-def');
const type = require ('sanctuary-type-identifiers');


const Item = $.NullaryType
  ('ShakrahList/Item')
  ('')
  (x => type (x) === 'ShakrahList/Item');

const List = $.NullaryType
  ('ShakrahList/List')
  ('')
  (x => type (x) === 'ShakrahList/List');

const Ratio = $.NullaryType
  ('ShakrahList/Ratio')
  ('')
  (x => type (x) === 'ShakrahList/Ratio');

const Recipe = $.RecordType ({
  title: $.String,
  instructions: $.String,
  ingredients: List,
  description: S.MaybeType ($.String),
  nutrition: S.MaybeType ($.String),
  servings: S.MaybeType ($.String),
});

module.exports = S.create ({
  checkTypes: true,
  env: S.env.concat ([List, Ratio, Item, Recipe]),
});
