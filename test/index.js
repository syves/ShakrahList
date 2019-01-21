'use strict';

const S = require ('../src/sanctuary');

const Amount = require ('../src/Amount');
const Ratio = require ('../src/Ratio');
const Item = require ('../src/Item');
const List = require ('../src/List');
const eq = require ('./eq');

suite ('Amount', () => {
  test ('show', () => {
    // eq (Amount.show (Amount.stück (1))) ('1');
    // eq (Amount.show (Amount.g (1)))     ('1 g');
    // eq (Amount.show (Amount.g (1500)))  ('1.5 kg');
    // eq (Amount.show (Amount.g (2000)))  ('2 kg');
    // eq (Amount.show (Amount.kg (2)))    ('2 kg');
    // eq (Amount.show (Amount.c (1)))     ('1 c');
    // eq (Amount.show (Amount.tbl (1)))   ('1 tbl');
    // eq (Amount.show (Amount.tsp (1)))   ('1 tsp');
    // eq (Amount.show (Amount.ml (1)))    ('1 ml');
    // eq (Amount.show (Amount.ml (1000))) ('1 l');
    // eq (Amount.show (Amount.l (5)))     ('5 l');
    // eq (Amount.show (Amount.c_ (1) (2))) ('1/2 c');
    // eq (Amount.show (Amount.tsp_ (1) (2))) ('1/2 tsp');
    // eq (Amount.show (Amount.tbl_ (1) (2))) ('1/2 tbl');
  });

  test ('show', () => {
    // eq (S.show (Amount.stück (1)))  ('Amount.stück (1)');
    // eq (S.show (Amount.g (1)))      ('Amount.g (1)');
    // eq (S.show (Amount.g (1500)))   ('Amount.g (1500)');
    // eq (S.show (Amount.g (2000)))   ('Amount.g (2000)');
    // eq (S.show (Amount.kg (2)))     ('Amount.g (2000)');
    // eq (S.show (Amount.c (1)))      ('Amount.c (1)');
    // eq (S.show (Amount.tbl (1)))    ('Amount.tbl (1)');
    // eq (S.show (Amount.tsp (1)))    ('Amount.tsp (1)');
    // eq (S.show (Amount.ml (1)))     ('Amount.ml (1)');
    // eq (S.show (Amount.ml (1000)))  ('Amount.ml (1000)');
    // eq (S.show (Amount.l (5)))      ('Amount.ml (5000)');
    // eq (S.show (Amount.c_ (1) (2))) ('Amount.c_ (1) (2)');
    // eq (S.show (Amount.c_ (6) (2))) ('Amount.c_ (3) (1)');
  });
  test ('S.concat', () => {
    eq (S.concat (Amount.stück (1)) (Amount.stück (1))) (Amount.stück (2));
    eq (S.concat (Amount.stück (1)) (Amount.c (1))) (Amount ({'stück': Ratio (1) (1), 'g': Ratio (0) (1), 'ml': Ratio (0) (1), 'tsp': Ratio (0) (1), 'tbl': Ratio (0) (1), 'c': Ratio (1) (1)}));
  });
});

suite ('List', () => {
  test ('S.show', () => {
    console.log (Item, List);
    // eq (S.show (List ([]))) ('List ([])');
    // eq (S.show (List ([Item ('x') (Amount.c (1))]))) ('List ([Item ("x") (Amount.c (1))])');
  });

  test ('S.concat', () => {
    // const x = Item ('x') (Amount.c (1));
    // const y = Item ('y') (Amount.c (1));
    // eq (S.concat (List ([])) (List ([]))) (List ([]));
    // eq (S.concat (List ([x])) (List ([]))) (List ([x]));
    // eq (S.concat (List ([])) (List ([x]))) (List ([x]));
    // eq (S.concat (List ([x])) (List ([y]))) (List ([x, y]));
    // eq (S.concat (List ([x])) (List ([x]))) (List ([Item ('x') (Amount.c (2))]));
  });
});

suite ('Ratio', () => {
  test ('S.show', () => {
    eq (S.show (Ratio (1) (2))) ('Ratio (1) (2)');
    eq (S.show (Ratio (6) (4))) ('Ratio (3) (2)');
    eq (S.show (Ratio (4) (4))) ('Ratio (1) (1)');
  });
  test ('S.equals', () => {
    eq (S.equals (Ratio (1) (2)) (Ratio (1) (2))) (true);
    eq (S.equals (Ratio (1) (2)) (Ratio (2) (4))) (true);
    eq (S.equals (Ratio (1) (2)) (Ratio (1) (1))) (false);
    eq (S.equals (Ratio (1) (2)) (Ratio (2) (2))) (false);
  });
  test ('S.concat', () => {
    eq (S.concat (Ratio (1) (2)) (Ratio (1) (2))) (Ratio (1) (1));
    eq (S.concat (Ratio (1) (2)) (Ratio (1) (3))) (Ratio (5) (6));
    eq (S.concat (Ratio (1) (2)) (Ratio (3) (4))) (Ratio (5) (4));
  });
});
