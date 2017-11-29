# qwebs-auth-jwt
Authentication service using [JSON Web Token](https://www.npmjs.com/package/jwt-simple) for [Qwebs server](https://www.npmjs.com/package/qwebs).
  
## Features

  * [Qwebs](https://www.npmjs.com/package/qwebs)
  * [Authentication](https://www.npmjs.com/package/jwt-simple)
  
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
    this.auth = $auth;
  };

  async connect(ask, reply) {
    const token = await this.auth.encode({ id: 12345 });
		reply.end({ token });
  };
};

exports = module.exports = MyService;
```

### Use $auth to authenticate user

```js
class MyService {
  constructor($auth) {
    this.auth = $auth;
  };

  async isConnected(ask, reply) {
    await this.auth.identify(ask, reply);
    const message = "I'm authorized."
    reply.end({ message });
	};
};

exports = module.exports = MyService;
```

## API

  * encode(payload)
  * decode(token)
  * identify(ask, reply)

## Installation

```bash
$ npm install qwebs-auth-jwt
```
