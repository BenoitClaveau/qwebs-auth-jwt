/*!
 * qwebs-auth-jwt
 * Copyright(c) 2017 Benoît Claveau <benoit.claveau@gmail.com>
 * MIT Licensed
 */
"use strict";

const QwebsAuthJwt = require('../lib/qwebs-auth-jwt');
const $config = {
    jwt: {
        secret: "01234"
    }
}
describe("auth", () => {

    it("encode", done => {
        const auth = new QwebsAuthJwt($config);
        const payload = {
            name: "My Name",
            version: 3
        }
        return auth.encode(payload).then(token => {
            expect(token).toBe("eyJ0eXAiOiJKV1QiLCJhbGciOiJIUzI1NiJ9.eyJuYW1lIjoiTXkgTmFtZSIsInZlcnNpb24iOjN9.m69S2NJymL3HA08_PWvsJ07WPtjtyPfXCon9A5ckd7E");
        }).catch(fail).then(done);
    });

    it("decode", done => {
        const auth = new QwebsAuthJwt($config);
        const token = "eyJ0eXAiOiJKV1QiLCJhbGciOiJIUzI1NiJ9.eyJuYW1lIjoiTXkgTmFtZSIsInZlcnNpb24iOjN9.m69S2NJymL3HA08_PWvsJ07WPtjtyPfXCon9A5ckd7E";
        return auth.decode(token).then(payload => {
            expect(payload.name).toBe("My Name");
            expect(payload.version).toBe(3);
        }).catch(fail).then(done);
    });

    it("single route", done => {
        const auth = new QwebsAuthJwt($config);
        const request = {
            headers: {
                authorization: "Bearer eyJ0eXAiOiJKV1QiLCJhbGciOiJIUzI1NiJ9.eyJuYW1lIjoiTXkgTmFtZSIsInZlcnNpb24iOjN9.m69S2NJymL3HA08_PWvsJ07WPtjtyPfXCon9A5ckd7E"
            }
        }
        const response = {};
        return auth.identify(request, response).then(() => {
            expect(request.payload.name).toBe("My Name");
            expect(request.payload.version).toBe(3);
        }).catch(fail).then(done);
    });
});