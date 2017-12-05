/*!
 * qwebs-auth-jwt
 * Copyright(c) 2015 Benoît Claveau <benoit.claveau@gmail.com>
 * MIT Licensed
 */
 
"use strict";

const { UndefinedError, HttpError, Error } = require("oups");
const jwt = require("jwt-simple");
const { Transform } = require("stream");
const through2 = require("through2");
    
class AuthenticationService {

    constructor($config) {
        if (!$config) throw new UndefinedError("$config");
        if (!$config.jwt) throw new UndefinedError("$config.jwt");
        if (!$config.jwt.secret) throw new UndefinedError("$config.jwt.secret");
        this.$config = $config;
    };

    identify(ask) {
        try {
            const authorization = ask.headers.authorization;
            if (!authorization || /^null$/i.test(authorization) || /^undefined$/i.test(authorization)) throw new Error("Authorization header is not defined for ${ask.request.url}.", { ask });
            const m = /(^Bearer\s)(\S*)/g.exec(authorization);
            if (!m || m.length != 3) throw new Error("Bearer token is invalid for ${ask.request.url}.", { ask });
            ask.payload = this.decode(m[2]);
            if (!ask.payload) throw new UndefinedError("Payload", { ask });
        }
        catch(error) {
            throw new HttpError(401, error);
        }
    };

    encode(payload) {
        try {
            const secret = Buffer.from(this.$config.jwt.secret);
            return jwt.encode(payload, secret);
        }
        catch(error) {
            throw error;
        }
    };

    decode(token) {
        const secret = Buffer.from(this.$config.jwt.secret);
        return jwt.decode(token, secret);
    };
};

exports = module.exports = AuthenticationService;