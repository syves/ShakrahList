'use strict';

/* eslint-disable max-len */

const S = require ('./sanctuary');
const Ratio = require ('./Ratio');

const Amount = module.exports = quantities => ({
  'quantities': quantities,
  '@@show': () => `Amount (${S.show (quantities)})`,
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
