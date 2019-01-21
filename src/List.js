'use strict';

const util = require ('util');

const S = require ('./sanctuary');

//  List :: Array Item -> List
//  ? How does constructor work? Sanctuary magic..
const List = module.exports = items => ({
  'constructor': {
    '@@type': 'ShakrahList/List',
  },
  'items': S.sort (items),
  '@@show': function() {
    return 'List (' + S.show (this.items) + ')';
  },
  [util.inspect.custom]: function() {
    return this['@@show'] ();
  },
  'fantasy-land/equals': function(other) {
    return S.equals (other.items) (this.items);
  },
  'fantasy-land/concat': function(other) {
    // [x] [y]    => [x, y]    => [x, y]    => [[x], [y]]    => [x, y]
    // [x] [x]    => [x, x]    => [x, x]    => [[x, x]]      => [xx]
    // [x, y] [x] => [x, y, x] => [x, x, y] => [[x, x], [y]] => [xx, y]
    // TODO support tps + tbl
   // return S.map (group => Item (group[0].name)
   //                             (S.reduce (add)
   //                                       (Amount)
   //                                       (group))))
    //
    //  Item :: String -> Amount -> Item
    //  Item.name :: Item -> String
    //  Item.amount :: Item -> Amount

   // group :: Array Item

   // S.map (Item.amount) (group)

   // S.reduce (???) (Ratio (0) (1)) (S.map (Item.amount) (group)) :: Ratio

    return List;
// return S.map (group => 
//  // Item.name is the same
//              (S.groupBy (S.equals)
//                          (S.sort (S.concat (this.items)
//                                            (other.items))));
  },
});
