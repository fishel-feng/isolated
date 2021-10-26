'use strict';

const express = require('express');
const request = require('supertest');
const connect = require('connect');
const http = require('http');
const isolated = require('../');

describe('isolated.test.js', function () {

    describe('test express middleware', function () {
        const app = express();
        app.use(isolated());
        app.get('/', (req, res) => {
            res.send('Hello World!')
        })

        it('should has the header `Cross-Origin-Opener-Policy` valued `same-origin` and `Cross-Origin-Embedder-Policy` valued `require-corp`', function (done) {
            request(app.listen())
                .get('/')
                .expect('Cross-Origin-Opener-Policy', 'same-origin')
                .expect('Cross-Origin-Embedder-Policy', 'require-corp')
                .expect('Hello World!')
                .expect(200, done);
        });
    });

    describe('test connect middleware', function () {
        const app = connect();
        app.use(isolated());
        app.use(function(req, res){
            res.end('Hello from Connect!');
        });

        it('should has the header `Cross-Origin-Opener-Policy` valued `same-origin` and `Cross-Origin-Embedder-Policy` valued `require-corp`', function (done) {
            request(http.createServer(app).listen())
                .get('/')
                .expect('Cross-Origin-Opener-Policy', 'same-origin')
                .expect('Cross-Origin-Embedder-Policy', 'require-corp')
                .expect('Hello from Connect!')
                .expect(200, done);
        });
    });
});
