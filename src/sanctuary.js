'use strict';

const S = require ('sanctuary');
const $ = require ('sanctuary-def');
const type = require ('sanctuary-type-identifiers');

const Item = $.NullaryType
  ('ShakrahList/Item')
  ('')
  ([])
  (x => type (x) === 'ShakrahList/Item');

const List = $.NullaryType
  ('ShakrahList/List')
  ('')
  ([])
  (x => type (x) === 'ShakrahList/List');

const Ratio = $.NullaryType
  ('ShakrahList/Ratio')
  ('')
  ([])
  (x => type (x) === 'ShakrahList/Ratio');

const Recipe = $.RecordType ({
  title: $.String,
  instructions: $.String,
  ingredients: List,
  description: $.Maybe ($.String),
  nutrition: $.Maybe ($.String),
  servings: $.Maybe ($.String),
});

module.exports = S.create ({
  checkTypes: false,  // enable once fluture-sanctuary-types has been updated
  env: S.env.concat ([List, Ratio, Item, Recipe]),
});
