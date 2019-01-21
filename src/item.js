'use strict';

const S = require ('./sanctuary');


module.exports = name => amount => ({
  'constructor': {'@@type': 'ShakrahList/Item'},
  name,
  amount,
  '@@show': () => `Item (${S.show (name)}) (${S.show (amount)})`,
  'fantasy-land/equals': function(other) {
    return S.equals (other.name) (this.name) &&
           S.equals (other.amount) (this.amount);
  },
  'fantasy-land/lte': function(other) {
    return S.lt (other.name) (this.name) ||
           (S.equals (other.name) (this.name) &&
            S.lte (other.amount) (this.amount));
  },
});
