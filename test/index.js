'use strict';

const S = require ('sanctuary');

const Amount = require ('../src/Amount');
const Ratio = require ('../src/Ratio');
const eq = require ('./eq');

suite ('Amount', () => {
  test ('show', () => {
    eq (Amount.show (Amount.stück (1))) ('1');
    eq (Amount.show (Amount.g (1)))     ('1 g');
    eq (Amount.show (Amount.g (1500)))  ('1.5 kg');
    eq (Amount.show (Amount.g (2000)))  ('2 kg');
    eq (Amount.show (Amount.kg (2)))    ('2 kg');
    eq (Amount.show (Amount.c (1)))     ('1 c');
    eq (Amount.show (Amount.tbl (1)))   ('1 tbl');
    eq (Amount.show (Amount.tsp (1)))   ('1 tsp');
    eq (Amount.show (Amount.ml (1)))    ('1 ml');
    eq (Amount.show (Amount.ml (1000))) ('1 l');
    eq (Amount.show (Amount.l (5)))     ('5 l');
    eq (Amount.show (Amount.c_ (1) (2))) ('1/2 c');
  });
  test ('show', () => {
    eq (S.show (Amount.stück (1)))  ('Amount.stück (1)');
    eq (S.show (Amount.g (1)))      ('Amount.g (1)');
    eq (S.show (Amount.g (1500)))   ('Amount.g (1500)');
    eq (S.show (Amount.g (2000)))   ('Amount.g (2000)');
    eq (S.show (Amount.kg (2)))     ('Amount.g (2000)');
    eq (S.show (Amount.c (1)))      ('Amount.c (1)');
    eq (S.show (Amount.tbl (1)))    ('Amount.tbl (1)');
    eq (S.show (Amount.tsp (1)))    ('Amount.tsp (1)');
    eq (S.show (Amount.ml (1)))     ('Amount.ml (1)');
    eq (S.show (Amount.ml (1000)))  ('Amount.ml (1000)');
    eq (S.show (Amount.l (5)))      ('Amount.ml (5000)');
    eq (S.show (Amount.c_ (1) (2))) ('Amount.c_ (1) (2)');
    eq (S.show (Amount.c_ (6) (2))) ('Amount.c_ (3) (1)');
  });
});

suite ('Ratio', () => {
  test ('S.show', () => {
    eq (S.show (Ratio (1) (2))) ('Ratio (1) (2)');
    eq (S.show (Ratio (6) (4))) ('Ratio (3) (2)');
    eq (S.show (Ratio (4) (4))) ('Ratio (1) (1)');
  });
});
