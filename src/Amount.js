'use strict';

const Amount = module.exports = {};

//    stück :: Number -> Amount
Amount.stück = value => ({unit: '@stück', value});

//    kg :: Number -> Amount
Amount.kg = value => Amount.g (value * 1000);

//    g :: Number -> Amount
Amount.g = value => ({unit: '@g', value});

//    l :: Number -> Amount
Amount.l = value => Amount.ml (value * 1000);

//    ml :: Number -> Amount
Amount.ml = value => ({unit: '@ml', value});

//    tbl :: Number -> Amount
Amount.tbl = value => ({unit: '@tbl', value});

//    tsp :: Number -> Amount
Amount.tsp = value => ({unit: '@tsp', value});

//    c :: Number -> Amount
Amount.c = value => ({unit: '@c', value});

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
