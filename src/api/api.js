var express = require('express');
var app = express();
var jwt = require('express-jwt');
var jwks = require('jwks-rsa');
var fs = require('fs')
const scopeAuthorization = require('./scopeAuthorization')
const bodyParser = require('body-parser')

var port = process.env.PORT || 3001;
var secret = process.env.NODE_ENV
if (process.env.DEVELOPMENT) {
  process.env.DEVELOPMENT
}

const getSecret = () => {
  // workaround for SSL certificate error due to SSL inspection
  if (process.env.NODE_ENV === 'development') {
    return fs.readFileSync('./keys/public.pem');
  }
  return jwks.expressJwtSecret({
    cache: true,
    rateLimit: true,
    jwksRequestsPerMinute: 5,
    jwksUri: "https://upwind.auth0.com/.well-known/jwks.json"
  })
}

const fromHeaderOrQuerystring = (req) => {
  if (req.headers.authorization && req.headers.authorization.split(' ')[0] === 'Bearer') {
    return req.headers.authorization.split(' ')[1];
  }
  if (req.headers.Authorization && req.headers.Authorization.split(' ')[0] === 'Bearer') {
    return req.headers.Authorization.split(' ')[1];
  }
  return null;
}

var jwtCheck = jwt({
  secret: getSecret(),
  audience: 'http://localhost:3001/api',
  issuer: "https://upwind.auth0.com/",
  algorithms: ['RS256'],
  getToken: fromHeaderOrQuerystring
});

if (process.env.NODE_ENV === 'development') {
  //var debugRequest = require('./debugRequest')
  //app.use(debugRequest());
}
app.use(jwtCheck);

// use authorization matcher middleware
app.use(scopeAuthorization());
app.use(bodyParser.json())

app.get('/api/test/read', function (req, res) {
  console.log('Get request, read action success')
  return res.json(true)
});

app.post('/api/test/write', function (req, res) {
  console.log('Post request, write action success')
  return res.json(true)
});

app.post('/api/test/delete', function (req, res) {
  console.log('Post request, delete action success')
  return res.json(true)
});


app.listen(port);
console.log('NODE_TLS_REJECT_UNAUTHORIZED:' + process.env.NODE_TLS_REJECT_UNAUTHORIZED)
console.log('API Listening on port:' + port)