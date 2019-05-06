'use strict';

const http = require ('http');

const Future = require ('fluture');

const Response = require ('./Response');
const matches = require ('./matches');
const routes = require ('./routes');
const S = require ('./sanctuary');

//    maybeToFuture :: x -> Maybe y -> Future x y
const maybeToFuture = x => maybe =>
  S.maybe (Future.reject (x))  // #1     b          Future x _
          (Future.of)          // #2     (a -> b)   (y -> Future x y)
          (maybe);             // #3     Maybe a    Maybe y
          /* return type */    // #4     b          Future x y

const server = http.createServer ((req, res) => {
  //    future :: Future Error Response
  const future =
  S.reduce (future => ([desc, handlers]) =>
              S.alt (future)
                    (S.chain (captures => {
                                const Allow =
                                  S.joinWith (', ') (Object.keys (handlers));
                                const defaultResponse =
                                  Response.MethodNotAllowed ({Allow}) ('');
                                return S.maybe (Future.of (defaultResponse))
                                               (handler => handler (captures))
                                               (S.get (S.K (true))
                                                      (req.method)
                                                      (handlers));
                              })
                             (maybeToFuture ('Path did not match')
                                            (matches (desc) (req.url)))))
           (Future.reject ('TK'))
           (routes);

  future.fork (
    err => {
      // Custom error handling...
    },
    response => {
      res.writeHead (response.statusCode, response.headers);
      res.write (response.body);
      res.end ();
    }
  );
});
server.listen (8000);
