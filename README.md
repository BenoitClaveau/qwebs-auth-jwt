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
const Qwebs = require("qwebs");
const qwebs = new Qwebs();

qwebs.inject("$auth", "qwebs-auth-jwt");
```

### Use $auth to connect user

```js
class MyService {
  constructor($auth) {
    this.$auth = $auth;
  };

  connect(request, response) {
    let payload = { 
      login: request.body.login 
    };
    return this.$auth.encode(payload).then(token => {
      return response.send({ request: request, content: { token: token } });
    });
  };
};

exports = module.exports = MyService; //Return a class. Qwebs will create it;
```

### Use $auth to authenticate user

```js
class MyService {
  constructor($auth) {
    this.$auth = $auth;
  };

  isConnected(request, response) {
    return self.$auth.identify(request, response).then(() => {
        let login = request.payload.login;
        if (login != "myLogin") throw new DataError({ statusCode: 401 });
        return response.send({ request: request, content: { status: "connected" } });
    });
  };
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
