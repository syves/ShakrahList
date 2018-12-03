'use strict';

const S = require ('sanctuary');

const Amount = require ('../src/Amount');
const Ratio = require ('../src/Ratio');
const eq = require ('./eq');

suite ('Amount', () => {
  test ('show', () => {
    eq (Amount.show (Amount.stück (1))) ('1');
    eq (Amount.show (Amount.g (1))) ('1 g');
    eq (Amount.show (Amount.g (1500))) ('1.5 kg');
    eq (Amount.show (Amount.g (2000))) ('2 kg');
    eq (Amount.show (Amount.kg (2))) ('2 kg');
    eq (Amount.show (Amount.c (1))) ('1 c');
    eq (Amount.show (Amount.tbl (1))) ('1 tbl');
    eq (Amount.show (Amount.tsp (1))) ('1 tsp');
    eq (Amount.show (Amount.ml (1))) ('1 ml');
    eq (Amount.show (Amount.ml (1000))) ('1 l');
    eq (Amount.show (Amount.l (5))) ('5 l');
  });
});

suite ('Ratio', () => {
  test ('S.show', () => {
    eq (S.show (Ratio (1) (2))) ('Ratio (1) (2)');
    eq (S.show (Ratio (6) (4))) ('Ratio (3) (2)');
    eq (S.show (Ratio (4) (4))) ('Ratio (1) (1)');
  });
});
