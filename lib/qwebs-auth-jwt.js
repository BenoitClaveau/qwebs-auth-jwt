/*!
 * qwebs-auth-jwt
 * Copyright(c) 2015 Benoît Claveau <benoit.claveau@gmail.com>
 * MIT Licensed
 */
 
"use strict";

const jwt = require("jwt-simple");
const { UndefinedError, HttpError } = require("oups");
    
class AuthenticationService {
    constructor($config) {
        if (!$config) throw new UndefinedError("$config");
        if (!$config.jwt) throw new UndefinedError("$config.jwt");
        if (!$config.jwt.secret) throw new UndefinedError("$config.jwt.secret");
        this.$config = $config;
    };

    identify(ask, reply) {
        try {
            const authorization = ask.request.headers.authorization;
            if (!authorization || /^null$/i.test(authorization) || /^undefined$/i.test(authorization)) throw new Error("Authorization header is not defined for ${ask.request.url}.", { ask });
            const m = /(^Bearer\s)(\S*)/g.exec(authorization);
            if (!m || m.length != 3) throw new Error("Bearer token is invalid for ${ask.request.url}.", { ask });
            const payload = this.decode(m[2]);
            if (!payload) throw new UndefinedError("Payload", { ask });
            ask.request.payload = payload;
        }
        catch(error) {
            throw new HttpError(401, error);
        }
    };

    encode(payload) {
        return jwt.encode(payload, this.$config.jwt.secret);
    };

    decode(token) {
        return jwt.decode(token, this.$config.jwt.secret);
    };
};

exports = module.exports = AuthenticationService;