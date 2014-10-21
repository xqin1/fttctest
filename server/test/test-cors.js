var should = require('should'),
    request = require('supertest'),
    app = require('../server');

describe('CORS test', function () {
    describe('route /* from same origin', function () {
        it('should return correct header', function (done) {
            request(app)
                .get('/api/something')
                .expect(200)
                .expect('Access-Control-Allow-Origin', '*')
                .end(done);
        });
    });
});