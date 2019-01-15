'use strict';

const assert = require ('assert');

const S = require ('../src/sanctuary');

module.exports = actual => expected => {
  assert.strictEqual (S.show (actual), S.show (expected));
  assert.strictEqual (S.equals (actual) (expected), true);
};
