'use strict';

const S = require ('sanctuary');
const Ratio = require ('./Ratio');


const Amount = module.exports = {};

['stück', 'g', 'ml', 'tbl', 'tsp', 'c'].forEach (unitType => {
  Amount[unitType] = value => ({
    'unit': `@${unitType}`,
    'value': Ratio (value) (1),
    '@@show': () => `Amount.${unitType} (${S.show (value)})`,
  });
});

['tbl', 'tsp', 'c'].forEach (unitType => {
  Amount[unitType + '_'] = num => denom => ({
    'unit': `@${unitType}`,
    'value': Ratio (num) (denom),
    '@@show': function() {
      // eslint-disable-next-line max-len
      return `Amount.${unitType}_ (${S.show (this.value.num)}) (${S.show (this.value.denom)})`;
    },
  });
});

Amount.kg = value => Amount.g (value * 1000);

Amount.l = value => Amount.ml (value * 1000);

// Amount.c_ => num => denom => Amount.c_ ( Ratio (num) (decom))
// eq (S.show (Amount.c (1/3)))   ('Amount.c (Ratio (1) (3))')

// support fractiona amounts


/*  amountCata : {currency :: String -> Number -> a
                  stück :: Number -> a,
                  tbl :: Number -> a,
                  tsp :: Number -> a,
                  c   :: Number -> a}
                  -> Amount
                  -> a
*/
Amount.cata = cases => amount =>
  cases[amount.unit] (amount.value.num);

//    show :: Amount -> String
Amount.show = Amount.cata ({
  '@stück': n => String (n),
  '@g': n => n >= 1000 ? String (n / 1000) + ' kg' : String (n) + ' g',
  '@tbl': n => String (n) + ' tbl',
  '@tsp': n => String (n) + ' tsp',
  '@c': n => String (n) + ' c',
  '@ml': n => n >= 1000 ? String (n / 1000) + ' l' : String (n) + ' ml',
});
