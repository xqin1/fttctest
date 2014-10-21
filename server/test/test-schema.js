'use strict';

var should = require('should'),
    request = require('supertest'),
    app = require('../server');


describe('get last update schema', function () {

    it('should response with valid date when request last update ', function (done) {
        request(app)
            .get('/api/schema/lastUpdate')
            .end(function (err, res) {
                if (err) {
                    return done(err);
                }

                res.should.have.status(200);
                res.should.have.header('Access-Control-Allow-Origin');
                res.body.should.have.property('status', 'successful');
                res.body.should.have.property('results').and.have.lengthOf(1);
                res.body.results[0].should.have.ownProperty('lastUpdated');
                new Date(res.body.results[0].lastUpdated).should.be.an.instanceof(Date);
                done();
            });
    });
});

describe('get mobile schema', function () {

    it('should response with the mobile schema JSON file ', function (done) {
        request(app)
            .get('/api/schema/mobileSchema')
            .end(function (err, res) {
                if (err) {
                    return done(err);
                }

                res.should.have.status(200);
                res.should.have.header('Access-Control-Allow-Origin');
                res.body.should.have.property('status', 'successful');
                res.body.should.have.property('results').and.have.lengthOf(1);
                done();
            });
    });
});

describe('get toll info by car type', function () {
    it('should response with sucess with Leesburg Toll Plaza on M and with axle number as 2 ', function (done) {
        request(app)
            .get('/api/schema/tollinfo/facilityID/M/type/tollplaza/name/Leesburg Toll Plaza/axleCount/2')
            .end(function (err, res) {
                if (err) {
                    return done(err);
                }
                res.should.have.status(200);
                res.should.have.header('Access-Control-Allow-Origin');
                res.body.should.have.property('status', 'successful');
                res.body.should.have.property('results').and.have.lengthOf(1);
                res.body.results[0].cashToll.should.be.exactly(3.0);
                res.body.results[0].sunPassToll.should.be.exactly(2.85);
                done();
            });
    });

    it('should response with 2 axle value with I-4 Connector Toll Plaza on S and with axle number as 5 ', function (done) {
        request(app)
            .get('/api/schema/tollinfo/facilityID/S/type/tollplaza/name/I-4%20Connector%20Toll%20Plaza/axleCount/5')
            .end(function (err, res) {
                if (err) {
                    return done(err);
                }
                res.body.results[0].cashToll.should.be.exactly(1.3);
                res.body.results[0].sunPassToll.should.be.exactly(1.04);
                done();
            });
    });



    it('should response with calculated value for C.R. 470 exit on M with axle 4 ', function (done) {
        request(app)
            .get('/api/schema/tollinfo/facilityID/M/type/exit/name/C.R. 470/axleCount/4')
            .end(function (err, res) {
                if (err) {
                    return done(err);
                }
                res.body.results[0].NB_ON.sunpass.should.be.exactly(3.12);
                res.body.results[0].NB_ON.cash.should.be.exactly(3.75);
                res.body.results[0].EB_ON.cash.should.be.exactly(999);


                done();
            });
    });

    it('should response with original value for University Dr. exit on SG with axle 4 ', function (done) {
        request(app)
            .get('/api/schema/tollinfo/facilityID/SG/type/exit/name/University Dr./axleCount/4')
            .end(function (err, res) {
                if (err) {
                    return done(err);
                }
                res.body.results[0].NB_OFF.sunpass.should.be.exactly(0.26);
                res.body.results[0].NB_OFF.cash.should.be.exactly(0.52);
                res.body.results[0].EB_ON.cash.should.be.exactly(999);
                done();
            });
    });
});