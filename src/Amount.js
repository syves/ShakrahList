'use strict';

const S = require ('sanctuary');


const Amount = module.exports = {};

const f = unitType => value => ({
  'unit': `@${unitType}`,
  'value': value,
  '@@show': () => `Amount.${unitType} (${S.show (value)})`,
});

//    stück :: Number -> Amount
Amount.stück = f ('stück');

//    kg :: Number -> Amount
Amount.kg = value => Amount.g (value * 1000);

//    g :: Number -> Amount
Amount.g = f ('g');

//    l :: Number -> Amount
Amount.l = value => Amount.ml (value * 1000);

//    ml :: Number -> Amount
Amount.ml = f ('ml');

//    tbl :: Number -> Amount
Amount.tbl = f ('tbl');

//    tsp :: Number -> Amount
Amount.tsp = f ('tsp');

//    c :: Number -> Amount
Amount.c = f ('c');

// todo support fractions of cups. tsp. tbl

/*  amountCata : {currency :: String -> Number -> a
                  stück :: Number -> a,
                  tbl :: Number -> a,
                  tsp :: Number -> a,
                  c   :: Number -> a}
                  -> Amount
                  -> a
*/
Amount.cata = cases => amount =>
  cases[amount.unit] (amount.value);

//    show :: Amount -> String
Amount.show = Amount.cata ({
  '@stück': n => String (n),
  '@g': n => n >= 1000 ? String (n / 1000) + ' kg' : String (n) + ' g',
  '@tbl': n => String (n) + ' tbl',
  '@tsp': n => String (n) + ' tsp',
  '@c': n => String (n) + ' c',
  '@ml': n => n >= 1000 ? String (n / 1000) + ' l' : String (n) + ' ml',
});
