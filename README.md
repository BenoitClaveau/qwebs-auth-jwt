# qwebs-auth-jwt
Authentication service using JSON Web Token for Qwebs server

## Add the jwt secret key the qwebs config file (config.json)

```json
{
	"jwt": {
        "secret": "secretCode"
    },
}
```

## Declare and inject the service $auth in Qwebs

```json
var Qwebs = require("qwebs");
var qwebs = new Qwebs();

this.qwebs.inject("$auth", "qwebs-auth-jwt");
```

## Use $auth in your connection service

```json
function MyService($auth) {
  this.$auth = $auth;
};

MyService.prototype.connect = function (request, response, promise) {
  return promise.then(function (self) {
    var payload = { 
      login: request.body.login 
    };
    return self.$auth.encode(payload).then(function(token) {
      return response.send({ request: request, content: { token: token } });
    });
  });
};

exports = module.exports = MyService; //Return a class. Qwebs will instanciate it;
```

## Use $auth in your own service

```json
function MyService($auth) {
  this.$auth = $auth;
};

MyService.prototype.isConnected = function (request, response, promise) {
  return promise.then(function (self) { 
    return self.$auth.identify(request, response).then(function() {
        var login = request.payload.login;
        if (login != "myLogin") throw new DataError({ statusCode: 401 });
        return response.send({ request: request, content: { status: "connected" } });
    });
  });
};

exports = module.exports = MyService; //Return a class. Qwebs will instanciate it;
```

## Features

  * Qwebs
  * Authentication
  * JSON Web Token
  * Promise

## Installation

```bash
$ npm install qwebs-auth-jwt
```