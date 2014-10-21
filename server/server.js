#!/bin/env node
var express = require('express'),
    app     = express();

// Load configurations
var env       = process.env.NODE_ENV || 'development',
    config    = require('./config/config.js')[env],
    ipaddress = process.env.OPENSHIFT_NODEJS_IP || config.ipaddress,
    port      = process.env.OPENSHIFT_NODEJS_PORT || config.port;

//for local development only
if (env === "local" || env === "development") {


    app.use('/api/image', express.static(__dirname + '/image'));
    app.use('/api/docs', express.static(__dirname + '/documents/codedoc'));

}

// set last update from config
app.use(function (req, res, next) {
    req.lastUpdate = config.lastUpdated;
    next();
});

// Bootstrap routes - this loads the index.js file in routes, which loads the individual routes files
require('./config/routes')(app);

// express settings
require('./config/express')(app, config);


//setup logger
var logger = require('./config/log.js')(config);

//read files
require('./config/read_files.js');

// Start the app by listening on <port>
app.listen(port, ipaddress, function() {
            console.log('%s: Node server started on %s:%d ...',
                        Date(Date.now() ), ipaddress, port);
});

// expose app
exports = module.exports = app;
