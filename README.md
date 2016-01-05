# qwebs-auth-jwt
Authentication service using [JSON Web Token](https://www.npmjs.com/package/jwt-simple) for [Qwebs server](https://www.npmjs.com/package/qwebs).
  
## Features

  * [Qwebs](https://www.npmjs.com/package/qwebs)
  * [Authentication](https://www.npmjs.com/package/jwt-simple)
  * [Promise](https://www.npmjs.com/package/q)
  
### Add the jwt secret key in config.json

```json
{
  "jwt": {
    "secret": "secretCode"
  },
}
```

### Declare and inject $auth

```js
var Qwebs = require("qwebs");
var qwebs = new Qwebs();

qwebs.inject("$auth", "qwebs-auth-jwt");
```

### Use $auth to connect user

```js
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

exports = module.exports = MyService; //Return a class. Qwebs will create it;
```

### Use $auth to authenticate user

```js
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

exports = module.exports = MyService; //Return a class. Qwebs will vreate it;
```

## API

  * encode(payload)
  * identify(request, response)
  * decode(token)

## Installation

```bash
$ npm install qwebs-auth-jwt
```
