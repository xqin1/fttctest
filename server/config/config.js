'use strict';
//TODO: add prod
var path = require('path'),
    rootPath = path.normalize(__dirname + '/..');

module.exports = {
    local: {
        env: 'local',
        root: rootPath,
        app: {
            name: 'Florida Turnpike Toll Calculator'
        },
        port: 3000,
        ipaddress: '127.0.0.1',
        log: {
            filename: './logs/server.log',
            handleExceptions: true,
            maxsize: 10485760
        },
        lastUpdated: '06/19/2014'
    },
    development: {
        env: 'development',
        root: rootPath,
        app: {
            name: 'Florida Turnpike Toll Calculator'
        },
        port: 3000,
        ipaddress: '127.0.0.1',
        log: {
            filename: './logs/server.log',
            handleExceptions: true,
            maxsize: 10485760
        },
        lastUpdated: '06/19/2014'
    },
    test: {},
    production: {}
};
