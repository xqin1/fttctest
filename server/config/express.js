'use strict';

var express = require('express'),
    bodyParser = require('body-parser'),
    compression = require('compression'),
    errorHandler = require('errorhandler'),
    customerErrorHandler = require('../util/errorHandling.js'),
    morgan = require('morgan'),
    cors = require('cors'),
    pkg = require('../package.json');

module.exports = function (app, config) {
    //enable CORS and configure pre-flight across board
    app.use(cors());
    app.options('*', cors());
    app.use(bodyParser());
    
    // expose package.json to views
    app.use(function (req, res, next) {
        console.log(config.lastUpdated)
        req.lastUpdate = config.lastUpdated;
        console.log(req.lastUpdate)
        next();
    });

    app.use(customerErrorHandler);

        // should be placed before express.static
    app.use(compression({
      filter: function (req, res) {
        return /json|text|javascript|css/.test(res.getHeader('Content-Type'));
      },
      level: 9
    }));


    app.use(morgan('dev'));

    //for development only
    if (config.env === "development" || config.env === "local") {
        app.use(errorHandler());
        app.locals.pretty = true;
    }

};

