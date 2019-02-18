'use strict';

const http = require ('http');

const S = require ('sanctuary');

const Response = require ('./Response');
const matches = require ('./matches');
const routes = require ('./routes');


const server = http.createServer ((req, res) => {
  const response =
  S.reduce (response_ => ([desc, handlers]) =>
              S.alt (response_)
                    (S.map (captures => {
                              const Allow =
                                S.joinWith (', ') (Object.keys (handlers));
                              const defaultResponse =
                                Response.MethodNotAllowed ({Allow}) ('');
                              return S.maybe (defaultResponse)
                                             (S.T (captures))
                                             (S.get (S.K (true))
                                                    (req.method)
                                                    (handlers));
                            })
                           (matches (desc) (req.url))))
           (S.Nothing)
           (routes);

  if (response.isJust) {
    res.writeHead (response.value.statusCode, response.value.headers);
    res.write (response.value.body);
    res.end ();
  } else {
    // Custom error handling...
  }
});
server.listen (8000);
