'use strict';
/**
 * @module crossdomain_header
 */
var apiresponse = require("../../util/apiresponse");
var getCurrentTime = require('../../util/getCurrentTime');
var express = require('express');
/**
 * for undefined routes, return Path Not Found error
 * @param app {object} the express server
 */
module.exports = function (app) {

	//Set documentation route
	app.use('/documentation', express.static(__dirname + './../../documents'));

    app.all('*', getCurrentTime, function (req, res, next) {
        req.statusCode = '404';
        req.message = "Path Not Found";
        return next();
    }, apiresponse.sendAPIResponse);
};
