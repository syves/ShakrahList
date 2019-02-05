'use strict';

const Response = module.exports

// Response.Ok :: StrMap String -> String -> Response
Response.Ok = headers => body => ({
  statusCode: 200,
  headers,
  body,
});


