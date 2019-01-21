'use strict';

const S = require ('./sanctuary');

//#   Ratio :: Integer -> Interger -> Ratio
//.
//.   Data constructor for the Ratio type.
//.
//.   > Ratio (2) (4)
//.   Ratio (1) (2)
const Ratio = module.exports = num => denom => {
  for (let n = 2; n <= denom; n += 1) {
    if (num % n === 0 && denom % n === 0) {
      return Ratio (num / n) (denom / n);
    }
  }
  return {
    'constructor': {'@@type': 'ShakrahList/Ratio'},
    num,
    denom,
    '@@show': () => `Ratio (${S.show (num)}) (${S.show (denom)})`,
    'fantasy-land/equals': other => other.num === num && other.denom === denom,
    'fantasy-land/concat': other =>
      Ratio (other.num * denom + num * other.denom) (denom * other.denom),
  };
};

//    Ratio.from : Integer -> Interger -> Integer -> Ratio
Ratio.from = whole => num => denom =>
  Ratio (whole * denom + num) (denom);
