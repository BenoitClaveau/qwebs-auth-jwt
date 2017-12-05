/*!
 * qwebs
 * Copyright(c) 2017 Benoît Claveau <benoit.claveau@gmail.com>
 * MIT Licensed
*/
"use strict"

const through2 = require("through2");

class InfoService {
	constructor($auth) {
        this.auth = $auth;
	};
    
    async connect(ask, reply) {
        reply.outputType = "object";
        ask.pipe(through2.obj(async (chunk, enc, callback) => {
            const token = this.auth.encode(chunk);
            callback(null, {token});
        })).pipe(reply);
    };
    
	async getInfo(ask, reply) {
        this.auth.identify(ask);
        reply.end(ask.payload);
	};
};

exports = module.exports = InfoService;