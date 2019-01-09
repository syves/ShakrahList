'use strict';

const S = require ('sanctuary');


const Amount = module.exports = {};

//    stück :: Number -> Amount
Amount.stück = value => ({'unit': '@stück',
                          'value': value,
                          '@@show': () => `Amount.stück (${S.show (value)})`});

//    kg :: Number -> Amount
Amount.kg = value => Amount.g (value * 1000);

//    g :: Number -> Amount
Amount.g = value => ({'unit': '@g',
                      'value': value,
                      '@@show': () => `Amount.g (${S.show (value)})`});

//    l :: Number -> Amount
Amount.l = value => Amount.ml (value * 1000);

//    ml :: Number -> Amount
Amount.ml = value => ({'unit': '@ml',
                      'value': value,
                      '@@show': () => `Amount.ml (${S.show (value)})`});

//    tbl :: Number -> Amount
Amount.tbl = value => ({'unit': '@tbl',
                      'value': value,
                      '@@show': () => `Amount.tbl (${S.show (value)})`});

//    tsp :: Number -> Amount
Amount.tsp = value => ({'unit': '@tsp',
                      'value': value,
                      '@@show': () => `Amount.tsp (${S.show (value)})`});

//    c :: Number -> Amount
Amount.c = value => ({'unit': '@c',
                      'value': value,
                      '@@show': () => `Amount.c (${S.show (value)})`});

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
