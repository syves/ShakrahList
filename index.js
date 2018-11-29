'use strict';

const Amount = {};

//    stück :: Number -> Amount
Amount.stück = value => ({unit: 'stück', value});

//    kg :: Number -> Amount
Amount.kg = value => Amount.g (value * 1000);

//    g :: Number -> Amount
Amount.g = value => ({unit: 'g', value});

//    l :: Number -> Amount
Amount.l = value => Amount.ml (value * 1000);

//    ml :: Number -> Amount
Amount.ml = value => ({unit: 'ml', value});

//    tbl :: Number -> Amount
Amount.tbl = value => ({unit: 'tbl', value});

//    tsp :: Number -> Amount
Amount.tsp = value => ({unit: 'tsp', value});

//    c :: Number -> Amount
Amount.c = value => ({unit: 'c', value});

//    array :: b -> (a -> Array a -> b) -> Array a -> b
const foldArray = defaultValue => f => xs =>
  xs.length === 0 ? defaultValue : f (xs[0]) (xs.slice (1));

// len : Array(a) -> Int
const len = foldArray (0) (head => tail => 1 + len (tail));

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
  stück: n => String (n),
  g: n => n >= 1000 ? String (n / 1000) + ' kg' : String (n) + ' g',
  tbl: n => String (n) + ' tbl',
  tsp: n => String (n) + ' tsp',
  c: n => String (n) + ' c',
});

//    show : Amount -> String
Amount.show2 = amount => {
  switch (amount.unit) {
    case 'stück': return String (amount.value);
    case 'g': return amount.value >= 1000 ?
                     String (amount.value / 1000) + ' kg' :
                     String (amount.value) + ' g';
    case 'ml': return amount.value >= 1000 ?
                     String (amount.value / 1000) + ' l' :
                     String (amount.value) + ' ml';
    case 'tbl': return String (amount.value) + ' tbl';
    case 'tsp': return String (amount.value) + ' tsp';
    case 'c': return String (amount.value) + ' c';
    default: throw new Error ('Unhandled amount.unit "' + amount.unit + '"');
  }
 };
