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
        // await this.auth.identify(ask, reply);
        // const message = "I'm authorized."
        // reply.end({ message });

        // ask.on("headers", headers => {
        //     const payload = this.auth.payloadSync(headers);
        //     const message = "I'm authorized."
        //     reply.end({ message });
        // });

        ask.pipe(this.auth.payload()).pipe(reply);
	};
};

exports = module.exports = InfoService;