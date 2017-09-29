/*!
 * qwebs-auth-jwt
 * Copyright(c) 2015 Benoît Claveau <benoit.claveau@gmail.com>
 * MIT Licensed
 */
 
"use strict";

const jwt = require('jwt-simple');
const { DataError } = require('qwebs');
    
class AuthenticationService {
    constructor($config) {
        if (!$config) throw new DataError({ message: "Config is not defined." });
        if (!$config.jwt) throw new DataError({ message: "Jwt section is not defined in qwebs config." });
        if (!$config.jwt.secret) throw new DataError({ message: "Jwt secret is not defined in qwebs config." });
        this.$config = $config;
    };

    identify(request, response) {
        return Promise.resolve().then(() => {
            const authorization = request.headers.authorization;
            if (!authorization || /^null$/i.test(authorization) || /^undefined$/i.test(authorization)) throw new DataError({ statusCode: 401 });
            const m = /(^Bearer\s)(\S*)/g.exec(authorization);
            if (!m || m.length != 3) throw new DataError({ statusCode: 401 });
            return this.decode(m[2]).then(payload => {
                if (!payload) throw new DataError({ statusCode: 401 });
                request.payload = payload;
                return payload;
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