/*!
 * qwebs-auth-jwt
 * Copyright(c) 2017 Benoît Claveau <benoit.claveau@gmail.com>
 * MIT Licensed
 */
"use strict";

const QwebsAuthJwt = require("../lib/qwebs-auth-jwt");
const expect = require("expect.js");

const $config = {
    jwt: {
        secret: "01234"
    }
}
describe("auth", () => {

    it("encode", () => {
        const auth = new QwebsAuthJwt($config);
        const payload = {
            name: "My Name",
            version: 3
        }
        expect(auth.encode(payload)).to.be("eyJ0eXAiOiJKV1QiLCJhbGciOiJIUzI1NiJ9.eyJuYW1lIjoiTXkgTmFtZSIsInZlcnNpb24iOjN9.m69S2NJymL3HA08_PWvsJ07WPtjtyPfXCon9A5ckd7E");
    });

    it("decode", done => {
        const auth = new QwebsAuthJwt($config);
        const token = "eyJ0eXAiOiJKV1QiLCJhbGciOiJIUzI1NiJ9.eyJuYW1lIjoiTXkgTmFtZSIsInZlcnNpb24iOjN9.m69S2NJymL3HA08_PWvsJ07WPtjtyPfXCon9A5ckd7E";
        const payload = auth.decode(token);
        expect(payload.name).to.be("My Name");
        expect(payload.version).to.be(3);
    });

    it("single route", done => {
        const auth = new QwebsAuthJwt($config);
        const request = {
            ask: {
                headers: {
                    authorization: "Bearer eyJ0eXAiOiJKV1QiLCJhbGciOiJIUzI1NiJ9.eyJuYW1lIjoiTXkgTmFtZSIsInZlcnNpb24iOjN9.m69S2NJymL3HA08_PWvsJ07WPtjtyPfXCon9A5ckd7E"
                }
            }
        }
        const response = {};
        auth.identify(request, response);
        expect(request.payload.name).to.be("My Name");
        expect(request.payload.version).to.be(3);
    });
});