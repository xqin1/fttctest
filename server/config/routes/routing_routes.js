'use strict';
/**
 * A module for all the routing routes
 * @module routing_routes
 */
var apiresponse = require("../../util/apiresponse");
var getCurrentTime = require("../../util/getCurrentTime");
var routing = require('../../app/controllers/routing_controller.js');

/**
 * @param app - returning the app object
 */

module.exports = function(app) {
    app.get('/api/routing/validEndPoints/startFacilityID/:startfacilityid/startExitNum/:startexitnum', getCurrentTime, routing.getValidEndPointsByStartPoint, apiresponse.sendAPIResponse);
    app.get('/api/routing/route/startFacilityID/:startfacilityid/startExitNum/:startexitnum/endFacilityID/:endfacilityid/endExitNum/:endexitnum', getCurrentTime, routing.getRouteAndToll, apiresponse.sendAPIResponse);
    app.get('/api/routing/route/startFacilityID/:startfacilityid/startExitNum/:startexitnum/endFacilityID/:endfacilityid/endExitNum/:endexitnum/axleCount/:axlecount', getCurrentTime, routing.getRouteAndTollByAxleCount, apiresponse.sendAPIResponse);

};