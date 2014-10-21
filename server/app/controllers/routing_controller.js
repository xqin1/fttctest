'use strict';
/**
 * A module that defines the response format.
 * @module routing_controller
 */

var validEndPoints = require('../../config/read_files.js').validEndPoints;
var routeData = require('../../config/read_files.js').routeData;

/** Get the valid endpoints that are connected to the input startpoint
* @param req - Input req object.  A startpointid param is required
* @param res - This is the callback response, lastUpdated object is returned in the result.
* @param next - Used to control flow, called once the function is ready to pass control.
*
* @returns {json} Returns an object with a key 'lastUpdated' and a value {datestamp}
*/
exports.getValidEndPointsByStartPoint = function(req, res, next) {
    req.result = null;
    if(!req.params.startfacilityid || !req.params.startexitnum){
        //If there is no startpoint provided
        req.statusCode = '400';
        req.message = 'No start point was specified.  Please include a startpointid in your request.';
    }
    else {
        validEndPoints.results.forEach(function(d){
            if (d.startFacilityID === req.params.startfacilityid && d.startExitNum === req.params.startexitnum) {
                req.result = d.endExits;
            }
        })
    }
    if (!req.result){
        req.statusCode = '404';
        req.message = 'The requested start point does not exist.'
    }
    next();
}

exports.getRouteAndToll = function(req, res, next) {
    req.result = null;
    if (!req.params.startfacilityid || !req.params.startexitnum || !req.params.endfacilityid || !req.params.endexitnum) {
        req.statusCode = '400';
        req.message = 'No start point or end point was specified.  Please include startpoint and endpoint in your request.';
    }
    else {
        routeData.routes.forEach(function (d) {
            if (d.startPoint.facilityID === req.params.startfacilityid && d.startPoint.exitNum === req.params.startexitnum) {
                d.endPoints.forEach(function (e) {
                    if (e.facilityID === req.params.endfacilityid && e.exitNum === req.params.endexitnum) {
                        var result = {};
                        result.sectionIDs = e.sectionIDs;
                        result.tollAmounts = e.tollAmounts;
                        req.result = result;

                    }
                });
            }
        });
        if (!req.result) {
            req.statusCode = '404';
            req.message = 'The requested route does not exist.'
        }
    }
    next();
}

exports.getRouteAndTollByAxleCount = function(req, res, next){
    //console.log(req.params)

    req.result = null;
    if (!req.params.startfacilityid || !req.params.startexitnum || !req.params.endfacilityid || !req.params.endexitnum || !req.params.axlecount) {
        req.statusCode = '400';
        req.message = 'No start point or end point or axle count was specified.  Please include startpoint, endpoint and axle count in your request.';
    }
    else {
        routeData.routes.forEach(function(d){
            if (d.startPoint.facilityID === req.params.startfacilityid && d.startPoint.exitNum === req.params.startexitnum) {
                d.endPoints.forEach(function(e){
                    if (e.facilityID === req.params.endfacilityid && e.exitNum === req.params.endexitnum){
                        e.tollAmounts.forEach(function(t){
                            if (t.axle === parseInt(req.params.axlecount)){
                                req.result = {};
                                req.result.tollAmounts = t;

                            }
                        });
                        if (req.result){
                            req.result.sectionIDs = e.sectionIDs;
                        }
                    }

                });
            }
        });
        if (!req.result){
            req.statusCode = '404';
            req.message = 'The requested route does not exist.'
        }
    }

    next()
}