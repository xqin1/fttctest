'use strict';
/**
 * A module for all the routing routes
 * @module app_schema_routes
 * @requires module:apiresponse
 * @requires module:getCurrentTime
 * @requires module:schemaController
 */
var apiresponse = require("../../util/apiresponse");
var getCurrentTime = require("../../util/getCurrentTime");
var schemaController = require('../../app/controllers/app_schema_controller.js');

/**
 * @param app - returning the app object
 */

module.exports = function(app) {
    app.get('/api/schema/lastUpdate', getCurrentTime, schemaController.getLastUpdate, apiresponse.sendAPIResponse);
    app.get('/api/schema/mobileSchema', getCurrentTime, schemaController.getMobileSchema, apiresponse.sendAPIResponse);
    app.get('/api/schema/imageData', getCurrentTime, schemaController.getImageData, apiresponse.sendAPIResponse);
    app.get('/api/schema/aboutData', getCurrentTime, schemaController.getAboutData, apiresponse.sendAPIResponse);
    app.get('/api/schema/tollInfo/facilityID/:facilityid/type/:type/name/:name/axleCount/:axlecount', getCurrentTime, schemaController.getTollInfo, apiresponse.sendAPIResponse);
};