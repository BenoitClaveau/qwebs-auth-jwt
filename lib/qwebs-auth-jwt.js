/*!
 * qwebs-auth-jwt
 * Copyright(c) 2015 Benoît Claveau
 * MIT Licensed
 */
 
"use strict";

const jwt = require('jwt-simple');
const DataError = require('qwebs').DataError;
    
class AuthenticationService {
    constructor($config) {
        if (!$config.jwt) throw new DataError({ message: "Jwt section is not defined in qwebs config." });
        if (!$config.jwt.secret) throw new DataError({ message: "Jwt secret is not defined in qwebs config." });
        this.$config = $config;
    };

    identify(request, response) {
        return Promise.resolve().then(() => {
            let authorization = request.headers.authorization;
            
            if (!authorization || authorization == "null") throw new DataError({ statusCode: 401 });
            
            return this.decode(authorization).then(payload => {
                if (!payload) throw new DataError({ statusCode: 401 });
                request.payload = payload;
            });
        });
    };

    encode(payload) {
        return Promise.resolve().then(() => {
            return jwt.encode(payload, this.$config.jwt.secret);
        });
    };

    decode(token) {
        return Promise.resolve().then(() => {
            return jwt.decode(token, this.$config.jwt.secret);
        });
    };
};

exports = module.exports = AuthenticationService;