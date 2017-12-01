/*!
 * qwebs-auth-jwt
 * Copyright(c) 2015 Benoît Claveau <benoit.claveau@gmail.com>
 * MIT Licensed
 */
 
"use strict";

const { UndefinedError, HttpError } = require("oups");
const jwt = require("jwt-simple");
const through2 = require("through2");
    
class AuthenticationService {
    constructor($config) {
        if (!$config) throw new UndefinedError("$config");
        if (!$config.jwt) throw new UndefinedError("$config.jwt");
        if (!$config.jwt.secret) throw new UndefinedError("$config.jwt.secret");
        this.$config = $config;
    };

    identifySync(ask, reply) {
        try {
            const authorization = ask.request.headers.authorization;
            if (!authorization || /^null$/i.test(authorization) || /^undefined$/i.test(authorization)) throw new Error("Authorization header is not defined for ${ask.request.url}.", { ask });
            const m = /(^Bearer\s)(\S*)/g.exec(authorization);
            if (!m || m.length != 3) throw new Error("Bearer token is invalid for ${ask.request.url}.", { ask });
            const payload = this.decodeSync(m[2]);
            if (!payload) throw new UndefinedError("Payload", { ask });
            ask.request.payload = payload;
        }
        catch(error) {
            throw new HttpError(401, error);
        }
    };

    encodeSync(payload) {
        return jwt.encode(payload, this.$config.jwt.secret);
    };

    decodeSync(token) {
        return jwt.decode(token, this.$config.jwt.secret);
    };

    encode() {
        return through2.obj(async (chunk, enc, callback) => {
            const token = this.encodeSync(chunk);
            callback(null, {token});
        });
    }

    identify() {
        const stream = through2.obj(async (chunk, enc, callback) => {
            callback(null, chunk, enc);
        });
    }
};

exports = module.exports = AuthenticationService;