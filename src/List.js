'use strict';

const util = require ('util');

const S = require ('./sanctuary');
const Amount = require ('./Amount');
const Item = require ('./Item');
const Ratio = require ('./Ratio');

//  List :: Array Item -> List
const List = module.exports = items => ({
  'constructor': {
    '@@type': 'ShakrahList/List',
  },
  'items': S.sort (items),
  '@@show': function() {
    return 'List (' + S.show (this.items) + ')';
  },
  [util.inspect.custom]: function() {
    return this['@@show'] ();
  },
  'fantasy-land/equals': function(other) {
    return S.equals (other.items) (this.items);
  },
  'fantasy-land/concat': function(other) {
    return List (S.map (S.reduce (acc => item =>
                                    Item (item.name)
                                         (S.concat (acc.amount)
                                                   (item.amount)))
                                 (Item ('bogus') (Amount.stück (0))))
                       (S.groupBy (x => y => S.equals (x.name) (y.name))
                                  (S.sort (S.concat (this.items)
                                                    (other.items)))));
  },
});

// List.present :: List -> Array String
List.present = list =>
  S.chain (item => S.map (([unit, {num, denom}]) =>
                            `${num}${denom === 1 ? '' : '/' + denom} ${unit} ${item.name}`) // eslint-disable-line max-len
                         (S.pairs (S.filter (S.gt (Ratio (0) (1)))
                                            (item.amount.quantities))))
          (list.items);
