'use strict';

const S = require ('sanctuary');

//    Ratio.Ratio : Integer -> Interger -> Ratio
const Ratio = module.exports = num => denom => {
  for (let n = 2; n <= denom; n += 1) {
    if (num % n === 0 && denom % n === 0) {
      return Ratio (num / n) (denom / n);
    }
  }
  return {
    num,
    denom,
    '@@show': () => `Ratio (${S.show (num)}) (${S.show (denom)})`,
  };
};

//    Ratio.from : Integer -> Interger -> Integer -> Ratio
Ratio.from = whole => num => denom =>
  Ratio (whole * denom + num) (denom);
