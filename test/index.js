'use strict';

const Amount = require ('../src/Amount');
const eq = require ('./eq');

suite ('Amount', () => {
  test ('show', () => {
    eq (Amount.show (Amount.stück (1))) ('1');
    eq (Amount.show (Amount.g (1))) ('1 g');
    eq (Amount.show (Amount.g (1500))) ('1.5 kg');
    eq (Amount.show (Amount.kg (2))) ('2 kg');
    eq (Amount.show (Amount.c (1))) ('1 c');
    eq (Amount.show (Amount.tbl (1))) ('1 tbl');
    eq (Amount.show (Amount.tsp (1))) ('1 tsp');
    eq (Amount.show (Amount.ml (1))) ('1 ml');
    eq (Amount.show (Amount.ml (1000))) ('1 l');
    eq (Amount.show (Amount.l (5))) ('5 l');
  });
});
