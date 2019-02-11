'use strict';

const S = require ('./sanctuary');
const Response = require ('./Response');

// :: StrMap (StrMap String -> a -> Response)
module.exports =
  // headersBodyResponse :: StrMap String -> String -> Response
  S.map (headersBodyResponse => headers => body =>
           headersBodyResponse (S.insert ('Content-Type')
                                         ('application/json')
                                         (headers))
                               (JSON.stringify (body)))
        (Response);
