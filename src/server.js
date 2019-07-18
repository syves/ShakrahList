'use strict';

const http = require ('http');

const Future = require ('fluture');

const JsonResponse = require ('./JsonResponse');
const Response = require ('./Response');
const matches = require ('./matches');
const routes = require ('./routes');
const S = require ('./sanctuary');

const { parse } = require ('querystring');

//    maybeToFuture :: x -> Maybe y -> Future x y
const maybeToFuture = x => maybe =>
  S.maybe (Future.reject (x))  // #1     b          Future x _
          (Future.of)          // #2     (a -> b)   (y -> Future x y)
          (maybe);             // #3     Maybe a    Maybe y
          /* return type */    // #4     b          Future x y

const server = http.createServer ((req, res) => {

  //    body :: Future String (Maybe String)
  const body =
    req.method === 'POST' ?
    Future ((reject, resolve) => {
      let body = '';
      req.on ('data', chunk => {
        body += chunk.toString (); // convert Buffer to string
      });
      req.on ('end', () => {
        S.maybe_ (() => {reject ('invalid JSON')})
                 (parsedBody => { resolve (S.Just (parsedBody))})
                 (S.parseJson (S.K (true)) (body));
      });
    }) :
    Future.of (S.Nothing);

  const future =
  S.chain (maybeParsedBody =>
             //reduce handlers to a single matching route, by folding into a Future.
             S.reduce (future => ([desc, handlers]) =>
                         // We use alt to choose between two futures, (so that we can iterate
                         // over the handlers, and choose the first that matches),
                         // chain is flatMap which is feeding 'captures':: Future Error StrMap
                         // to S.maybe (see 34), only if the value is a Maybe,
                         S.alt (S.chain (captures => {
                                           const AllowedMethods =
                                             S.joinWith (', ') (Object.keys (handlers));
                                           const defaultResponse =
                                             Response.MethodNotAllowed ({AllowedMethods}) ('');
                                           //if the req.Method is suported, then pass the-
                                           //the captures :: StrMap to the functon,
                                           //or yield error for meth not allowed.
                                           return S.maybe (Future.of (defaultResponse))
                                                          (handler => handler (captures) (maybeParsedBody))
                                                          (S.value (req.method)
                                                                   (handlers));
                                         })
                                         //:: Future (Err) (Maybe StrMap)
                                        (maybeToFuture ('Path did not match')
                                                       (matches (desc) (req.url))))
                               (future))
                      (Future.reject ('TK'))
                      (routes /* :: Array (Pair (Array Component) (StrMap (??? -> ???))) */))
          (body)

  future.fork (
    err => {
      console.error(err)
      console.log
    },
    response => {
      res.writeHead (response.statusCode, response.headers);
      res.write (response.body);
      res.end ();
    }
  );
});
server.listen (8000);
