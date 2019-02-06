'use strict';

const http = require ('http');

const S = require ('sanctuary');


//    transKey :: String -> String
const transKey = s => s.replace (/ ./g, s => S.toUpper (s))
                       .replace (/\W/g, '');

//    transVal :: Integer -> StrMap String -> String -> Response
const transVal = statusCode => headers => body => ({
  statusCode,
  headers,
  body,
});

module.exports =
  S.fromPairs (S.map (S.bimap (transKey) (transVal))
                     (S.map (S.swap) (S.pairs (http.STATUS_CODES))));
