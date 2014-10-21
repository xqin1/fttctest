//run this script to get sectionIDs for those routes where there is error while run on client side
'use strict';
var table = "1Lx8daY2IpysxN41ZsW__odViFwcDc4T50XlG8qGs";
var apiKey = "AIzaSyBUcrnc-5Y3rVaWKJlx0EadasWDxoRy__4";
var qGetSectionID = "select TP_Section_ID ";
var url = 'https://www.googleapis.com/fusiontables/v1/query?sql=';

var fs = require('fs');
var async = require('async');
var request = require('request');
var routeData1 = fs.readFileSync('./data/routes_and_toll_raw.json', 'utf8');
var routeData = JSON.parse(routeData1);
var count = 0;
var myRoutes = [];
//routeData.routes.forEach(function (route, routeIndex) {
//        //console.log(route);
//        route.endPoints.forEach(function(endPoint, endPointIndex) {
//            if (typeof endPoint.sectionIDs == 'undefined') {
//                    count++;
//                var obj = {};
//                obj.routeIndex = routeIndex;
//                obj.endPointIndex = endPointIndex;
//                obj.whereSectionIDs = endPoint.whereSectionIDs;
//                obj.sectionIDs = [];
//                myRoutes.push(obj);
//            }
//        })
//});
//console.log('routes without sectionIDs ' + count);
//console.log(myRoutes[1]);
count = 0;

//check tolls which are 0
count=0;
routeData.routes.forEach(function (route, routeIndex) {
    //console.log(route);
    route.endPoints.forEach(function (endPoint, endPointIndex) {
        if (typeof endPoint.tollAmounts !== 'undefined') {
            if (endPointIndex > -1){
               // console.log(endPoint.tollAmounts)
                endPoint.tollAmounts.forEach(function(tollAmount, tollAmountIndex){
                    var plazaAmountSunpass = 0;
                    var plazaAmountCash = 0;
                    if (typeof tollAmount.routeAmount.tollPlazas != 'undefined'){
                        if (tollAmount.routeAmount.tollPlazas.length > 0){
                            tollAmount.routeAmount.tollPlazas.forEach(function(t){
                                plazaAmountSunpass += t.sp;
                                plazaAmountCash += t.cash;
                            })
                        }
                    }
                    tollAmount.sp = tollAmount.routeAmount.start.sp + tollAmount.routeAmount.end.sp + plazaAmountSunpass;
                    tollAmount.cash = tollAmount.routeAmount.start.cash + tollAmount.routeAmount.end.cash + plazaAmountCash;

                })
            }
        }
    })
})

//verify
routeData.routes.forEach(function (route, routeIndex) {
    //console.log(route);
    route.endPoints.forEach(function (endPoint, endPointIndex) {
        if (typeof endPoint.tollAmounts !== 'undefined') {
            if (endPointIndex > -1){
                endPoint.tollAmounts.forEach(function(tollAmount, tollAmountIndex){
                    if (tollAmount.sp == 0 && tollAmount.cash == 0 && typeof tollAmount.routeAmount.tollPlazas != 'undefined'){
                        //console.log(tollAmount.routeAmount.tollPlazas)
                        console.log('start ' + route.startPoint.facilityID + " " + route.startPoint.exitNum);
                        console.log('end ' + endPoint.facilityID + " " + endPoint.exitNum);
                        count++;
                    }
                })
            }
        }
    })
})
console.log(count);
//fs.writeFile(__dirname + '/../data/routes_and_toll.json', JSON.stringify(routeData), function (err, done) {
//    if (err) throw err;
//    console.log("route data finished")
//})


//runFirstQuery();

function runFirstQuery() {
    async.forEach(myRoutes,
        function(myRoute, callback) {
          var whereClause = " where " + myRoute.whereSectionIDs.firstWhere.replace('A/B', ''); //replace for B line 3A/B exit
          var url = 'https://www.googleapis.com/fusiontables/v1/query?sql=' + qGetSectionID + "from " + table + whereClause + "&key=" + apiKey;
            request({
                "rejectUnauthorized": false,
                "url": url,
                "method": "GET"
            }, function (err, response, body) {
                if (err) {
                    callback();
                } else {
                    var data = JSON.parse(body);
                    if (typeof data.rows !== 'undefined') {
                        data.rows.forEach(function (r) {
                            myRoute.sectionIDs.push(r[0]);
                        })
                    }
                    callback();
                }
            });
        },
        function(){
            runSecondQuery();
        }
    )
}

function runSecondQuery(){
    async.forEach(myRoutes,
        function(myRoute, callback) {
            var whereClause = " where " + myRoute.whereSectionIDs.secondWhere.replace('A/B', ''); //replace for B line 3A/B exit
            var url = 'https://www.googleapis.com/fusiontables/v1/query?sql=' + qGetSectionID + "from " + table + whereClause + "&key=" + apiKey;
            request({
                "rejectUnauthorized": false,
                "url": url,
                "method": "GET"
            }, function (err, response, body) {
                if (err) {
                    callback();
                } else {
                    var data = JSON.parse(body);
                    if (typeof data.rows !== 'undefined') {
                        data.rows.forEach(function (r) {
                            myRoute.sectionIDs.push(r[0]);
                        })
                    }
                    callback();
                }
            });
        },
        function(){
            matchSectionID();
        }
    )
}

function matchSectionID() {
    routeData.routes.forEach(function (route, routeIndex) {
        //console.log(route);
        route.endPoints.forEach(function(endPoint, endPointIndex) {
            myRoutes.forEach(function(myRoute) {
                if (myRoute.routeIndex == routeIndex && myRoute.endPointIndex == endPointIndex && typeof endPoint.sectionIDs == 'undefined') {
                    //console.log('find')
                    endPoint.sectionIDs = myRoute.sectionIDs;
                }
            })
        })
    })

    var c1 = 0, c2 =0;

    routeData.routes.forEach(function (route, routeIndex) {
        //console.log(route);
        route.endPoints.forEach(function(endPoint, endPointIndex) {
            if (typeof endPoint.sectionIDs == 'undefined'){
                c1 ++;
            } else {
                if (endPoint.sectionIDs.length == 0) {
                    c2 ++;
                }
            }

        })
    })
    console.log ('final undefined sectionsIDs ' + c1);
    console.log('final empty sectionIDs ' + c2);

    fs.writeFile(__dirname + '/../data/routes_and_toll.json', JSON.stringify(routeData), function (err, done) {
        if (err) throw err;
        console.log("route data finished")
    })
}

//function runFirstQuery() {
//    async.forEach(myRoutes,
//        function (route, callback1) {
//            if (routeIndex < 100) {
//                async.forEach(route.endPoints,
//                    function (endPoint, callback) {
//                        if (typeof endPoint.sectionIDs == 'undefined') {
//                            countArray.push(1);
//                            //console.log("start " + route.startPoint.facilityID + " " + route.startPoint.exitNum);
//                            // console.log("end " + endPoint.facilityID + " " + endPoint.exitNum);
//                            var whereClause = " where " + endPoint.whereSectionIDs.firstWhere.replace('A/B', ''); //replace for B line 3A/B exit
//                            var url = 'https://www.googleapis.com/fusiontables/v1/query?sql=' + qGetSectionID + "from " + table + whereClause + "&key=" + apiKey;
//                            request({
//                                "rejectUnauthorized": false,
//                                "url": url,
//                                "method": "GET"
//                            }, function (err, response, body) {
//                                if (err) {
//                                    callback(err);
//                                } else {
//                                    var data = JSON.parse(body);
//                                    if (typeof data.rows !== 'undefined') {
//                                        endPoint['sectionID1'] = new Array();
//                                        data.rows.forEach(function (r) {
//                                            endPoint.sectionID1.push(r[0]);
//                                        })
//                                    }
//                                    routeData.routes[0].endPoints[0].sectionID1 = endPoint.sectionID1;
//                                    // console.log(routeData.routes[0].endPoints[0].sectionID1)
//                                    callback();
//                                }
//                            });
//                        } else {
//                            callback();
//                        }
//                    },
//                    function (err) {
//                        //console.log(err)
//                    }
//                )
//            }
//        }, function (err) {
//
//        }
//});

//routeData.routes.forEach(function (route, routeIndex) {
//    //console.log(route);
//    route.endPoints.forEach(function(endPoint, endPointIndex) {
//        myRoutes.forEach(function(myRoute) {
//            if (myRoute.routeIndex == routeIndex && myRoute.endPointIndex == endPointIndex && typeof endPoint.sectionIDs == 'undefined') {
//               //console.log('find')
//                endPoint.sectionIDs = [];
//            }
//        })
//    })
//})
//
//routeData.routes.forEach(function (route, routeIndex) {
//    //console.log(route);
//    route.endPoints.forEach(function(endPoint, endPointIndex) {
//        if (endPoint.sectionIDs.length == 0) {
//            count++;
//        }
//    })
//});
//console.log('my ' + count);

//first query
//async.forEachSeries(routeData.routes, function(route, callback_s1) {
//        async.forEachSeries(route.endPoints, function(endPoint, callback_s2) {
//                        if (typeof endPoint.sectionIDs == 'undefined') {
//                             var whereClause = " where " + endPoint.whereSectionIDs.firstWhere.replace('A/B', ''); //replace for B line 3A/B exit
//                            var url = 'https://www.googleapis.com/fusiontables/v1/query?sql=' + qGetSectionID + "from " + table + whereClause + "&key=" + apiKey;
//                            request({
//                                "rejectUnauthorized": false,
//                                "url": url,
//                                "method": "GET"
//                            }, function (err, response, body) {
//                                if (err) {
//                                    callback_s2();
//                                } else {
//                                    var data = JSON.parse(body);
//                                    if (typeof data.rows !== 'undefined') {
//                                        endPoint['sectionID1'] = new Array();
//                                        data.rows.forEach(function (r) {
//                                            endPoint.sectionID.push(r[0]);
//                                        })
//                                    }
//                                    callback_s2();
//                                }
//                            });
//                        } else {
//                            callback_s2();
//                        }
//            }, function () {
//                callback_s1(); //end of second loop
//            }
//        );
//
//    }, function() {//outer loop finished
//        //runSecondQuery();
//    }
//
//);

//function runSecondQuery() {
//    console.log('second');
//    routeData.routes.forEach(function (route, routeIndex) {
//        if (routeIndex < 100) {
//            route.endPoints.forEach(function(endPoint){
//                if (typeof endPoint.sectionIDs == 'undefined') {
//
//                    console.log('section ')
//                }
//                else {
//                    //console.log('defined')
//                }
//            })
//
//        }
//    })
//}


////    console.log('countArray ' + countArray.length);
////
////    console.log(routeData.routes[0].endPoints[0].sectionID1)
////
////
////    routeData.routes.forEach(function (route, routeIndex) {
////        if (routeIndex < 100) {
////            route.endPoints.forEach(function(endPoint){
////                if (typeof endPoint.sectionIDs == 'undefined') {
////
////                    console.log('section ' + endPoint.sectionID1)
////                }
////            })
////
////        }
////    })
////    //runSecondQuery();
//}
//
//function runSecondQuery() {
//    routeData.routes.forEach(function (route, routeIndex) {
//        if (routeIndex < 100) {
//            async.forEach(route.endPoints,
//                function (endPoint, callback) {
//                    if (typeof endPoint.sectionIDs == 'undefined') {
//                        countArray.push(1);
//                        console.log("start " + route.startPoint.facilityID + " " + route.startPoint.exitNum);
//                        console.log("end " + endPoint.facilityID + " " + endPoint.exitNum);
//                        console.log(endPoint.sectionID1);
////                        var whereClause = " where " + endPoint.whereSectionIDs.firstWhere.replace('A/B', ''); //replace for B line 3A/B exit
////                        var url = 'https://www.googleapis.com/fusiontables/v1/query?sql=' + qGetSectionID + "from " + table + whereClause + "&key=" + apiKey;
////                        request({
////                            "rejectUnauthorized": false,
////                            "url": url,
////                            "method": "GET"
////                        }, function (err, response, body) {
////                            if (err) {
////                                callback(err);
////                            } else {
////                                console.log(url);
////                                console.log(body);
////                                if (typeof body.rows !== 'undefined'){
////                                    endPoint.sectionID1 = [];
////                                    body.rows.forEach(function(r){
////                                        endPoint.sectionID1.push(r[0]);
////                                    })
////                                }
////                                callback();
////                            }
////                        });
//                    } else {
//                        callback();
//                    }
//                },
//                function (err) {
//                    //console.log(err)
//                }
//            )
//        }
//    });
//    console.log('countArray ' + countArray.length);
//}
//
//
