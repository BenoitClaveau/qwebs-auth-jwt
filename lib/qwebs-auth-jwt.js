/*!
 * qwebs-auth-jwt
 * Copyright(c) 2015 Benoît Claveau
 * MIT Licensed
 */
 
"use strict";

const Q = require('q');
const jwt = require('jwt-simple');
const DataError = require('qwebs').DataError;
    
class AuthenticationService {
    constructor($config) {
        if (!$config.jwt) throw new DataError({ message: "Jwt section is not defined in qwebs config." });
        if (!$config.jwt.secret) throw new DataError({ message: "Jwt secret is not defined in qwebs config." });
        this.$config = $config;
    };

    identify(request, response) {
        var self = this;
        
        var authorization = request.headers.authorization;
        
        return Q.try(function(){
            if (!authorization || authorization == "null") throw new DataError({ statusCode: 401 });
            
            return self.decode(authorization).then(function(payload){
                if (!payload) throw new DataError({ statusCode: 401 });
                request.payload = payload;
            });
        });
    };

    encode(payload) {
        var self = this;
        
        return Q.try(function() {
            return jwt.encode(payload, self.$config.jwt.secret);
        });
    };

    decode(token) {
        var self = this;
        
        return Q.try(function() {
            return jwt.decode(token, self.$config.jwt.secret);
        });
    };
};

exports = module.exports = AuthenticationService;