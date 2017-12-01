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
            ask.payload = this.encodeSync(m[2]);
            if (!ask.payload) throw new UndefinedError("Payload", { ask });
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
        const stream = through2.obj(async (chunk, enc, callback) => {
            const token = this.encodeSync(chunk);
            callback(null, {token});
        });
        return stream;
    }

    decode() {
        const auth = this;
        const stream = through2.obj((chunk, enc, callback) => {
            callback(null, chunk, enc);
        });
        stream.on("ask", ask => {
            auth.identify(ask);
        });
        return stream;
    }
};

exports = module.exports = AuthenticationService;