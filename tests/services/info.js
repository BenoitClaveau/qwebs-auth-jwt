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
        //read ask body;
        const token = await this.auth.encode({ id: 1024});
		reply.end({ token });
    };
    
	async getInfo(ask, reply) {
        await this.auth.identify(ask, reply);
        const message = "I'm authorized."
		reply.end({ message });
	};
};

exports = module.exports = InfoService;