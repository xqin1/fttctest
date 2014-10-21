'use strict';

var should = require('should'),
    request = require('supertest'),
    app = require('../server');

// var testScript = [{
//         "startFacilityID":        'WB',
//         "startFacilityNumber":    11,
//         "endFacilityID":          'WB',
//         "endFacilityNumber":      0,
//         "expected2axleSP":        1.56,
//         "expected2axleCash":      2
//     },{
//         "startFacilityID":        'M',
//         "startFacilityNumber":    309,
//         "endFacilityID":          'B',
//         "endFacilityNumber":      8,
//         "expected2axleSP":        4.41,
//         "expected2axleCash":      5
//     }];


// test based on json doesnt work.
// for(var v = 0; v < testScript.length; v++){
//     describe('GET COST BETWEEN FACILITIES', function () {
//         it('should have property', function (done) {
//             request(app)
//                 .get(String('/api/routing/route/startFacilityID/' + String(testScript[v].startFacilityID) + '/startExitNum/' + String(testScript[v].startFacilityNumber) + '/endFacilityID/' + String(testScript[v].endFacilityID) + '/endExitNum/' + String(testScript[v].endFacilityNumber) + '/axleCount/2'))
//                 .expect(200)
//                 .end(function (err, res) {
//                     res.should.have.status(200);
//                     res.should.have.header('Access-Control-Allow-Origin');
//                     (JSON.parse(res.text).results[0].tollAmounts).should.have.property('sp', Number(testScript[v].expected2axleSP));
//                     (JSON.parse(res.text).results[0].tollAmounts).should.have.property('cash', Number(testScript[v].expected2axleCash));
//                     done();
//             });
            
//         });
//     });
// };





// Test 1, M309 to B8 - should be $4.41 Sunpass $5.00 Cash
describe('get cost between two stops', function () {
    it('M 309 to B 8 Should Be $4.41 sunpass AND 5 cash ', function (done) {
        request(app)
            .get('/api/routing/route/startFacilityID/M/startExitNum/309/endFacilityID/B/endExitNum/8/axleCount/2')
            .end(function (err, res) {
                if (err) {
                    return done(err);
                }
                res.should.have.status(200);
                res.should.have.header('Access-Control-Allow-Origin');
                (JSON.parse(res.text).results[0].tollAmounts).should.have.property('sp', 4.13);
                (JSON.parse(res.text).results[0].tollAmounts).should.have.property('cash', 4.75);
                done();
            });
    });
});

// Test 2, WB11 to WB0 - should be $1.56 Sunpass $2.00 Cash
describe('get cost between two stops', function () {
    it('WB 11 to WB 0 Should Be $1.56 sunpass AND 2 cash ', function (done) {
        request(app)
            .get('/api/routing/route/startFacilityID/WB/startExitNum/11/endFacilityID/WB/endExitNum/0/axleCount/2')
            .end(function (err, res) {
                if (err) {
                    return done(err);
                }
                res.should.have.status(200);
                res.should.have.header('Access-Control-Allow-Origin');
                (JSON.parse(res.text).results[0].tollAmounts).should.have.property('sp', 1.56);
                (JSON.parse(res.text).results[0].tollAmounts).should.have.property('cash', 2);
                done();
            });
    });
});

// Test 3, SC55 to V2A - should be $4.94 Sunpass
describe('get cost between two stops', function () {
    it('SC 55 to V 2A Should Be $4.94 ', function (done) {
        request(app)
            .get('/api/routing/route/startFacilityID/SC/startExitNum/55/endFacilityID/V/endExitNum/2A/axleCount/2')
            .end(function (err, res) {
                if (err) {
                    return done(err);
                }
                res.should.have.status(200);
                res.should.have.header('Access-Control-Allow-Origin');
                (JSON.parse(res.text).results[0].tollAmounts).should.have.property('sp', 4.94);
                // (JSON.parse(res.text).results[0].tollAmounts).should.have.property('cash', 2);
                done();
            });
    });
});

// Test 4, H0 to M116 - should be $7.89 Sunpass 
describe('get cost between two stops', function () {
    it('H 0 to M 116 CASH Should Be $9.85 ', function (done) {
        request(app)
            .get('/api/routing/route/startFacilityID/H/startExitNum/0/endFacilityID/M/endExitNum/116/axleCount/2')
            .end(function (err, res) {
                if (err) {
                    return done(err);
                }
                res.should.have.status(200);
                res.should.have.header('Access-Control-Allow-Origin');
                (JSON.parse(res.text).results[0].tollAmounts).should.have.property('cash', 9.85);
                // (JSON.parse(res.text).results[0].tollAmounts).should.have.property('cash', 2);
                done();
            });
    });
});

// Test 5, P0 to P24 - should be $3.12 Sunpass $3.75 Cash
// describe('get cost between two stops', function () {
//     it('P 0 to P 24 Should Be $3.12 sunpass AND 3.75 cash ', function (done) {
//         request(app)
//             .get('/api/routing/route/startFacilityID/P/startExitNum/0/endFacilityID/P/endExitNum/24/axleCount/2')
//             .end(function (err, res) {
//                 if (err) {
//                     return done(err);
//                 }
//                 res.should.have.status(200);
//                 res.should.have.header('Access-Control-Allow-Origin');
//                 (JSON.parse(res.text).results[0].tollAmounts).should.have.property('sp', 3.12);
//                 (JSON.parse(res.text).results[0].tollAmounts).should.have.property('cash', 3.75);
//                 done();
//             });
//     });
// });

// Test 5, SKYWAY16 to SKYWAY5 - should be $3.12 Sunpass $3.75 Cash
describe('get cost between two stops', function () {
    it('SKYWAY 16 to SKYWAY 5 Should Be $1.04 sunpass AND 1.25 cash ', function (done) {
        request(app)
            .get('/api/routing/route/startFacilityID/SKYWAY/startExitNum/16/endFacilityID/SKYWAY/endExitNum/5/axleCount/2')
            .end(function (err, res) {
                if (err) {
                    return done(err);
                }
                res.should.have.status(200);
                res.should.have.header('Access-Control-Allow-Origin');
                (JSON.parse(res.text).results[0].tollAmounts).should.have.property('sp', 1.04);
                (JSON.parse(res.text).results[0].tollAmounts).should.have.property('cash', 1.25);
                done();
            });
    });
});