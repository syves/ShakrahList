'use strict';

/* eslint-disable max-len */

const S = require ('./sanctuary');
const Ratio = require ('./Ratio');

const Amount = module.exports = quantities => ({
  'quantities': quantities,
  'fantasy-land/equals': function(other) {
    return S.equals (this.quantities) (other.quantities);
  },
  'fantasy-land/concat': function(other) {
    return Amount ({'stück': S.concat (quantities['stück']) (other.quantities['stück']),
                    'g': S.concat (quantities['g']) (other.quantities['g']),
                    'ml': S.concat (quantities['ml']) (other.quantities['ml']),
                    'tsp': S.concat (quantities['tsp']) (other.quantities['tsp']),
                    'tbl': S.concat (quantities['tbl']) (other.quantities['tbl']),
                    'c': S.concat (quantities['c']) (other.quantities['c'])});
  },
});

//    empty :: { stück :: Ratio, g :: Ratio, ml :: Ratio, tsp :: Ratio, tbl :: Ratio, c :: Ratio }
const empty = {stück: Ratio (0) (1), g: Ratio (0) (1), ml: Ratio (0) (1), tsp: Ratio (0) (1), tbl: Ratio (0) (1), c: Ratio (0) (1)};

Amount.stück = num =>          Amount (S.insert ('stück') (Ratio (num) (1)) (empty));
Amount.g     = num =>          Amount (S.insert ('g')     (Ratio (num) (1)) (empty));
Amount.ml    = num =>          Amount (S.insert ('ml')    (Ratio (num) (1)) (empty));
Amount.tsp   = num =>          Amount (S.insert ('tsp')   (Ratio (num) (1)) (empty));
Amount.tbl   = num =>          Amount (S.insert ('tbl')   (Ratio (num) (1)) (empty));
Amount.c     = num =>          Amount (S.insert ('c')     (Ratio (num) (1)) (empty));
Amount.tsp_  = num => denom => Amount (S.insert ('tsp')   (Ratio (num) (denom)) (empty));
Amount.tbl_  = num => denom => Amount (S.insert ('tbl')   (Ratio (num) (denom)) (empty));
Amount.c_    = num => denom => Amount (S.insert ('c')     (Ratio (num) (denom)) (empty));


Amount.kg = value => Amount.g (value * 1000);

Amount.l = value => Amount.ml (value * 1000);

/*  Amount.cata :: { stück :: Number -> a
                   , g     :: Number -> a
                   , ml    :: Number -> a
                   , c     :: Number -> Number -> a
                   , tsp   :: Number -> Number -> a
                   , tbl   :: Number -> Number -> a }
                -> Amount
                -> a
*/
Amount.cata = cases => amount => {
  switch (amount.unit) {
    case '@stück':
    case '@g':
    case '@ml':
      return cases[amount.unit] (amount.value.num);
    case '@c':
    case '@tsp':
    case '@tbl':
      return cases[amount.unit] (amount.value.num) (amount.value.denom);
  }
};

//    show :: Amount -> String
Amount.show = Amount.cata ({
  '@stück': n => String (n),
  '@g': n => n >= 1000 ? String (n / 1000) + ' kg' : String (n) + ' g',
  '@tbl': num => denom =>
    String (num) + (denom === 1 ? '' : '/' + String (denom)) + ' tbl',
  '@tsp': num => denom =>
    String (num) + (denom === 1 ? '' : '/' + String (denom)) + ' tsp',
  '@c': num => denom =>
    String (num) + (denom === 1 ? '' : '/' + String (denom)) + ' c',
  '@ml': n => n >= 1000 ? String (n / 1000) + ' l' : String (n) + ' ml',
});
