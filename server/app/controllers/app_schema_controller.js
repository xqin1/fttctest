'use strict';

var schemaData = require('../../config/read_files.js').schemaData;
var imageData = require('../../config/read_files.js').imageData;
var aboutData = require('../../config/read_files.js').aboutData;
var ce = require('cloneextend');

/**
 * A module that defines the response format.
 * @module app_schema_controller
 */

/** Get the timestamp for the last update
* @param req - Input req object.  No request parameters are required.
* @param res - This is the callback response, lastUpdated object is returned in the result.
* @param next - Used to control flow, called once the function is ready to pass control.
*
* @returns {json} Returns an object with a key 'lastUpdated' and a value {datestamp}
*/
exports.getLastUpdate = function(req, res, next) {
    var lastUpdated = {};
    lastUpdated.lastUpdated = schemaData.schemaData.metaData.lastUpdate;
    lastUpdated.schemaData = schemaData.schemaData.metaData.lastUpdate;
    lastUpdated.imageData = imageData.lastUpdated;
    lastUpdated.aboutData = aboutData.lastUpdated;

    req.result = lastUpdated;
    next()
}

/** Get the mobile schema/all information.
* @param req - Input req object
* @param res - This is the callback response
* @param next - Used to control flow, called once the function is ready to pass control.
*
* @returns {json} Returns an object with the entire schema
*/
exports.getMobileSchema = function(req, res, next) {

    req.result = schemaData;
    next()
}

exports.getImageData = function(req, res, next) {

    req.result = imageData;
    next()
}

exports.getAboutData = function(req, res, next) {
    req.result = aboutData;
    next()
}

/** Get the toll information for specific exit/toll plaza.
 * @param req - Input req object
 * @param res - This is the callback response
 * @param next - Used to control flow, called once the function is ready to pass control.
 *
 * @returns {json} Returns an object with the entire schema
 */
exports.getTollInfo = function(req, res, next) {
    var axleVarialbeMap = {'2': 'two', '3':'three', '4':'four', '5': 'five', '6': 'six', '7': 'seven', '8': 'eight' };
    req.result = null;
    if (parseInt(req.params.axlecount) < 2 || parseInt(req.params.axlecount) > 8){
            req.result = [];
            req.statusCode = '400';
            req.message = 'Axle count must be a number between 2 and 8.';
    }
    else {
        schemaData.schemaData.regions.forEach(function(region){
            region.facilities.forEach(function(facility){
                if (facility.facilityID == req.params.facilityid){
                    if (req.params.type.toUpperCase() == 'TOLLPLAZA'){
                        facility.tollPlazas.forEach(function(tollPlaza){
                            if (tollPlaza.name == req.params.name){
                                //req.result = ce.clone(tollPlaza);
                                var cObj = ce.clone(tollPlaza);
                                req.result = {};
                                req.result.name = cObj.name;
                                req.result.altName = cObj.altName;
                                req.result.isBridge = cObj.isBridge;
                                req.result.description = cObj.description;
                                req.result.milePost = cObj.milePost;
                                req.result.coordinates = cObj.coordinates;
                                req.result.cashToll = cObj.twoAxle.cash;
                                req.result.sunPassToll = cObj.twoAxle.sunPass;
                                if (req.result.name != 'I-4 Connector Toll Plaza' ){
                                    req.result.cashToll = parseFloat(parseFloat(cObj.twoAxle.cash * (req.params.axlecount - 1)).toFixed(2));
                                    req.result.sunPassToll = parseFloat(parseFloat(cObj.twoAxle.sunPass * (req.params.axlecount - 1)).toFixed(2));

                                }

                            }
                        })
                    }
                    else if (req.params.type.toUpperCase() == 'EXIT'){
                        facility.exits.forEach(function(exit){
                            if (exit.name == req.params.name){
                                //req.result = ce.clone(exit);
                                var cObj = ce.clone(exit);
                                req.result = {};
                                req.result.name = cObj.name;
                                req.result.altName = cObj.altName;
                                req.result.exitNum = cObj.exitNum;
                                req.result.exitNumber = cObj.exitNumber;
                                req.result.milePost = cObj.milePost;
                                req.result.validStart = cObj.validStart;
                                req.result.coordinates = cObj.coordinates;
                                req.result.sunpassOnly = cObj.sunpassOnly;
                                req.result.ticketSystem = cObj.ticketSystem;
                                req.result.tollByPlate = cObj.tollByPlate;
                                for (var key in cObj.twoAxle){
                                    req.result[key] = cObj.twoAxle[key];
                                }
                                if (facility.facilityID != 'SG'){
                                    for (var key in req.result){
                                        if (req.result.hasOwnProperty(key)){
                                            if (typeof req.result[key] == 'object') {
                                                for (var subkey in req.result[key]){
                                                    if (req.result[key].hasOwnProperty(subkey)){
                                                        if (subkey == 'sunpass' || subkey == 'cash'){
                                                            if (req.result[key][subkey] != 999){
                                                                req.result[key][subkey] = req.result[key][subkey] * (req.params.axlecount -1);
                                                            }
                                                        }
                                                    }
                                                }
                                            }
                                        }
                                    }
                                }
                            }
                        })
                    }
                }
            })
        })

        if (!req.result){
            req.statusCode = '404';
            req.message = 'The requested facility does not exist.'
        }
    }

    next();
}
