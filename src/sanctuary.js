'use strict';

const S = require ('sanctuary');
const $ = require ('sanctuary-def');
const type = require ('sanctuary-type-identifiers');


const Ratio = $.NullaryType
  ('ShakrahList/Ratio')
  ('')
  (x => type (x) === 'ShakrahList/Ratio');

module.exports = S.create ({
  checkTypes: true,
  env: S.env.concat ([Ratio]),
});
