'use strict';

const S = require ('../src/sanctuary');
const matches = require ('../src/matches');
const {Literal, Wild} = require ('../src/Component');
const eq = require ('./eq');

test ('matches', () => {
 eq (matches ([Literal ('foos'), Wild ('id')]) ('/foos/123')) (S.Just ({id: '123'}));
 eq (matches ([Literal ('foos'), Wild ('id')]) ('/foos/123/bars')) (S.Nothing);
 eq (matches ([Literal ('foos')]) ('/foos')) (S.Just ({}));
 eq (matches ([Literal ('foos')]) ('/bars')) (S.Nothing);

});
