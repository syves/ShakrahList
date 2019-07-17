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
      console.log('reqUrl: '+req.url+ ' resMeth '+ req.method + ' reqData '+ res.body);
  //    future :: Future Error Response
  const future =
  //reduce handlers to a single matching route, by folding into a Future.
  S.reduce (future => ([desc, handlers]) =>
              // todo remove
              //console.log('desc ' + desc);
              S.map (m => console.log(S.value (m))) (matches (desc) (req.url));
              //We use alt to choose between two futures?
              //chain is flatMap which feeding 'captures':: Future Error StrMap
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
                                               (handler => handler (captures))
                                               (S.value (req.method)
                                                        (handlers));
                              })
                              //:: Future (Err) (Maybe StrMap)
                             (maybeToFuture ('Path did not match')
                                            (matches (desc) (req.url))))
                    (future))
           (Future.reject ('TK'))
           (routes /* :: Array (Pair (Array Component) (StrMap (??? -> ???))) */);

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
