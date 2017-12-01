/*!
 * qwebs
 * Copyright(c) 2017 Benoît Claveau <benoit.claveau@gmail.com>
 * MIT Licensed
*/
"use strict"

class InfoService {
	constructor($auth) {
        this.auth = $auth;
	};
    
    async connect(ask, reply) {
        reply.outputType = "object";
        ask.pipe(this.auth.encode()).pipe(reply);
    };
    
	async getInfo(ask, reply) {
        reply.outputType = "object"
        ask.pipe(this.auth.decode()).pipe(reply);
	};
};

exports = module.exports = InfoService;