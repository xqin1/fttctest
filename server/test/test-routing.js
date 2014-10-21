'use strict';

var should = require('should'),
    request = require('supertest'),
    app = require('../server'),
    context = describe;

/**
*
*/

describe('get valid end points route', function () {


    it('should response with sucess with start point at exit 2B on V line ', function (done) {
        request(app)
            .get('/api/routing/validEndPoints/startFacilityID/V/startExitNum/2B')
            .end(function (err, res) {
                if (err) {
                    return done(err);
                }

                res.should.have.status(200);
                res.should.have.header('Access-Control-Allow-Origin');
                res.body.should.have.property('status', 'successful');
                res.body.should.have.property('results').and.have.lengthOf(1);
                res.body.results[0].should.have.ownProperty('exitNum').equal('2A');
                done();
            });
    });

    it('should response with statusCod 404 with non-existing start point', function (done) {
        request(app)
            .get('/api/routing/validEndPoints/startFacilityID/V/startExitNum/3B')
            .end(function (err, res) {
                if (err) {
                    return done(err);
                }

                res.should.have.status(200);
                res.should.have.header('Access-Control-Allow-Origin');
                res.body.should.have.property('statusCode', '404');
                res.body.should.have.property('message');
                res.body.should.have.property('results').and.have.lengthOf(0);
                done();
            });
    });
});

describe('get toll and route for all car types', function () {
    it('should response with sucess with start point at exit 16 on V line and end point at exit 9 on V ', function (done) {
        request(app)
            .get('/api/routing/route/startFacilityID/V/startExitNum/16/endFacilityID/V/endExitNum/9')
            .end(function (err, res) {
                if (err) {
                    return done(err);
                }
                res.should.have.status(200);
                res.should.have.header('Access-Control-Allow-Origin');
                res.body.should.have.property('status', 'successful');
                res.body.should.have.property('results').and.have.lengthOf(1);
                res.body.results[0].should.have.property('tollAmounts').and.have.lengthOf(7);


                done();
            });
    });
});

describe('get toll and route by car type', function () {
    it('should response with sucess with start point at exit 16 on V line and end point at exit 9 on V and with axle number as 2 ', function (done) {
        request(app)
            .get('/api/routing/route/startFacilityID/V/startExitNum/16/endFacilityID/V/endExitNum/9/axleCount/2')
            .end(function (err, res) {
                if (err) {
                    return done(err);
                }
                res.should.have.status(200);
                res.should.have.header('Access-Control-Allow-Origin');
                res.body.should.have.property('status', 'successful');
            res.body.should.have.property('results').and.have.lengthOf(1);
                res.body.results[0].tollAmounts.should.have.property('axle', 2);
                res.body.results[0].tollAmounts.routeAmount.tollPlazas.should.be.an.instanceof(Array).and.have.lengthOf(1);
                done();
            });
    });
});
