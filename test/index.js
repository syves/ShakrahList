'use strict';

const S = require ('../src/sanctuary');

const Amount = require ('../src/Amount');
const Ratio = require ('../src/Ratio');
const Item = require ('../src/Item');
const List = require ('../src/List');
const eq = require ('./eq');

suite ('Amount', () => {
  test ('show', () => {
    eq (S.show (Amount.stück (1)))  ('Amount ({"c": Ratio (0) (1), "g": Ratio (0) (1), "ml": Ratio (0) (1), "stück": Ratio (1) (1), "tbl": Ratio (0) (1), "tsp": Ratio (0) (1)})');
    eq (S.show (Amount.g (1)))      ('Amount ({"c": Ratio (0) (1), "g": Ratio (1) (1), "ml": Ratio (0) (1), "stück": Ratio (0) (1), "tbl": Ratio (0) (1), "tsp": Ratio (0) (1)})');
    eq (S.show (Amount.g (1500)))   ('Amount ({"c": Ratio (0) (1), "g": Ratio (1500) (1), "ml": Ratio (0) (1), "stück": Ratio (0) (1), "tbl": Ratio (0) (1), "tsp": Ratio (0) (1)})');
    eq (S.show (Amount.g (2000)))   ('Amount ({"c": Ratio (0) (1), "g": Ratio (2000) (1), "ml": Ratio (0) (1), "stück": Ratio (0) (1), "tbl": Ratio (0) (1), "tsp": Ratio (0) (1)})');
    eq (S.show (Amount.kg (2)))     ('Amount ({"c": Ratio (0) (1), "g": Ratio (2000) (1), "ml": Ratio (0) (1), "stück": Ratio (0) (1), "tbl": Ratio (0) (1), "tsp": Ratio (0) (1)})');
    eq (S.show (Amount.c (1)))      ('Amount ({"c": Ratio (1) (1), "g": Ratio (0) (1), "ml": Ratio (0) (1), "stück": Ratio (0) (1), "tbl": Ratio (0) (1), "tsp": Ratio (0) (1)})');
    eq (S.show (Amount.tbl (1)))    ('Amount ({"c": Ratio (0) (1), "g": Ratio (0) (1), "ml": Ratio (0) (1), "stück": Ratio (0) (1), "tbl": Ratio (1) (1), "tsp": Ratio (0) (1)})');
    eq (S.show (Amount.tsp (1)))    ('Amount ({"c": Ratio (0) (1), "g": Ratio (0) (1), "ml": Ratio (0) (1), "stück": Ratio (0) (1), "tbl": Ratio (0) (1), "tsp": Ratio (1) (1)})');
    eq (S.show (Amount.ml (1)))     ('Amount ({"c": Ratio (0) (1), "g": Ratio (0) (1), "ml": Ratio (1) (1), "stück": Ratio (0) (1), "tbl": Ratio (0) (1), "tsp": Ratio (0) (1)})');
    eq (S.show (Amount.ml (1000)))  ('Amount ({"c": Ratio (0) (1), "g": Ratio (0) (1), "ml": Ratio (1000) (1), "stück": Ratio (0) (1), "tbl": Ratio (0) (1), "tsp": Ratio (0) (1)})');
    eq (S.show (Amount.l (5)))      ('Amount ({"c": Ratio (0) (1), "g": Ratio (0) (1), "ml": Ratio (5000) (1), "stück": Ratio (0) (1), "tbl": Ratio (0) (1), "tsp": Ratio (0) (1)})');
    eq (S.show (Amount.c_ (1) (2))) ('Amount ({"c": Ratio (1) (2), "g": Ratio (0) (1), "ml": Ratio (0) (1), "stück": Ratio (0) (1), "tbl": Ratio (0) (1), "tsp": Ratio (0) (1)})');
    eq (S.show (Amount.c_ (6) (2))) ('Amount ({"c": Ratio (3) (1), "g": Ratio (0) (1), "ml": Ratio (0) (1), "stück": Ratio (0) (1), "tbl": Ratio (0) (1), "tsp": Ratio (0) (1)})');
    eq (S.show (Amount.tsp_ (1) (2))) ('Amount ({"c": Ratio (0) (1), "g": Ratio (0) (1), "ml": Ratio (0) (1), "stück": Ratio (0) (1), "tbl": Ratio (0) (1), "tsp": Ratio (1) (2)})');
    eq (S.show (Amount.tbl_ (1) (4))) ('Amount ({"c": Ratio (0) (1), "g": Ratio (0) (1), "ml": Ratio (0) (1), "stück": Ratio (0) (1), "tbl": Ratio (1) (4), "tsp": Ratio (0) (1)})');
  });
  test ('S.concat', () => {
    eq (S.concat (Amount.stück (1)) (Amount.stück (1))) (Amount.stück (2));
    eq (S.concat (Amount.stück (1)) (Amount.c (1))) (Amount ({'stück': Ratio (1) (1), 'g': Ratio (0) (1), 'ml': Ratio (0) (1), 'tsp': Ratio (0) (1), 'tbl': Ratio (0) (1), 'c': Ratio (1) (1)}));
  });
});

suite ('List', () => {
  test ('S.show', () => {
    eq (S.show (List ([]))) ('List ([])');
    eq (S.show (List ([Item ('x') (Amount.c (1))]))) ('List ([Item ("x") (Amount ({"c": Ratio (1) (1), "g": Ratio (0) (1), "ml": Ratio (0) (1), "stück": Ratio (0) (1), "tbl": Ratio (0) (1), "tsp": Ratio (0) (1)}))])');
  });
  test ('List.present', () => {
    eq (List.present (List ([Item ('Mango') (Amount.stück (1)), Item ('Mushrooms') (Amount.c (2))])))
       (['1 stück Mango', '2 c Mushrooms']);
    eq (List.present (List ([Item ('Mango') (Amount.stück (1)), Item ('Mushrooms') (Amount.c_ (1) (2))])))
       (['1 stück Mango', '1/2 c Mushrooms']);
  });

  test ('S.concat', () => {
    const x = Item ('x') (Amount.c (1));
    const y = Item ('y') (Amount.c (1));
    const y2 = Item ('y') (Amount.c (2));
    const y3 = Item ('y') (Amount.c (3));
    eq (S.concat (List ([])) (List ([]))) (List ([]));
    eq (S.concat (List ([x])) (List ([]))) (List ([x]));
    eq (S.concat (List ([])) (List ([x]))) (List ([x]));
    eq (S.concat (List ([x])) (List ([y]))) (List ([x, y]));
    eq (S.concat (List ([x])) (List ([x]))) (List ([Item ('x') (Amount.c (2))]));
    eq (S.concat (List ([y])) (List ([y2]))) (List ([y3]));
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
  test ('Ratio.from', () => {
    eq (Ratio.from (1) (2) (3)) (Ratio (5) (3));
  });
});
