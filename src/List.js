'use strict';

const util = require ('util');

const S = require ('./sanctuary');

//  List :: Array Item -> List
module.exports = items => {
  return {
    constructor: {
      '@@type': 'ShakrahList/List',
    },
    items: S.sort (items),
    '@@show': function() {
      return 'List (' + S.show (this.items) + ')';
    },
    [util.inspect.custom]: function() {
      return this['@@show'] ();
    },
    'fantasy-land/equals': function(other) {
      return S.equals (other.items) (this.items);
    },
  }
};

